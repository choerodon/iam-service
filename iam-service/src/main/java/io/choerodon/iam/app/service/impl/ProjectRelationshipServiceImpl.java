package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.ProjectRelationship.PROJECT_RELATIONSHIP_ADD;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import io.choerodon.asgard.saga.annotation.Saga;
import io.choerodon.asgard.saga.dto.StartInstanceDTO;
import io.choerodon.asgard.saga.feign.SagaClient;
import io.choerodon.core.exception.CommonException;
import io.choerodon.core.iam.ResourceLevel;
import io.choerodon.iam.api.dto.ProjectRelationshipDTO;
import io.choerodon.iam.api.dto.RelationshipCheckDTO;
import io.choerodon.iam.api.dto.payload.ProjectRelationshipInsertPayload;
import io.choerodon.iam.app.service.ProjectRelationshipService;
import io.choerodon.iam.domain.repository.ProjectRelationshipRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
import io.choerodon.iam.infra.dataobject.ProjectDO;
import io.choerodon.iam.infra.dataobject.ProjectRelationshipDO;
import io.choerodon.iam.infra.enums.ProjectCategory;

/**
 * @author Eugen
 */
@Service
public class ProjectRelationshipServiceImpl implements ProjectRelationshipService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectRelationshipServiceImpl.class);
    private static final String PROJECT_NOT_EXIST_EXCEPTION = "error.project.not.exist";
    private static final String PROGRAM_CANNOT_BE_CONFIGURA_SUBPROJECTS = "error.program.cannot.be.configured.subprojects";
    private static final String AGILE_CANNOT_CONFIGURA_SUBPROJECTS = "error.agile.projects.cannot.configure.subprojects";
    private static final String RELATIONSHIP_NOT_EXIST_EXCEPTION = "error.project.relationship.not.exist";


    private ProjectRelationshipRepository projectRelationshipRepository;
    private ProjectRepository projectRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private SagaClient sagaClient;

    public ProjectRelationshipServiceImpl(ProjectRelationshipRepository projectRelationshipRepository, ProjectRepository projectRepository, SagaClient sagaClient) {
        this.projectRelationshipRepository = projectRelationshipRepository;
        this.projectRepository = projectRepository;
        this.sagaClient = sagaClient;
    }

    @Override
    public List<ProjectRelationshipDTO> getProjUnderGroup(Long projectId) {
        ProjectDO projectDO = projectRepository.selectByPrimaryKey(projectId);
        if (projectDO == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        }
        if (!projectDO.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
                !projectDO.getCategory().equalsIgnoreCase(ProjectCategory.ANALYTICAL.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }
        return projectRelationshipRepository.seleteProjectsByParentId(projectId);
    }

    @Override
    public void removesAProjUnderGroup(Long groupId) {
        ProjectRelationshipDO projectRelationshipDO = projectRelationshipRepository.selectByPrimaryKey(groupId);
        if (projectRelationshipDO == null) {
            throw new CommonException(RELATIONSHIP_NOT_EXIST_EXCEPTION);
        }
        projectRelationshipRepository.deleteGroup(groupId);
    }

    @Override
    public RelationshipCheckDTO checkRelationshipCanBeEnabled(Long id) {
        ProjectRelationshipDO projectRelationshipDO = projectRelationshipRepository.selectByPrimaryKey(id);
        if (projectRelationshipDO == null) {
            throw new CommonException(RELATIONSHIP_NOT_EXIST_EXCEPTION);
        } else if (projectRelationshipDO.getEnabled()) {
            throw new CommonException("error.check.relationship.is.already.enabled");
        }
        return checkDate(projectRelationshipDO);
    }

    @Override
    public List<Map<String, Date>> getUnavailableTime(Long projectId, Long parentId) {
        ProjectDO project = projectRepository.selectByPrimaryKey(projectId);
        if (project == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (!project.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(PROGRAM_CANNOT_BE_CONFIGURA_SUBPROJECTS);
        }
        ProjectDO parent = projectRepository.selectByPrimaryKey(parentId);
        if (parent == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (parent.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }
        //查询projectId所有被建立的关系
        ProjectRelationshipDO selectTmpDO = new ProjectRelationshipDO();
        selectTmpDO.setProjectId(projectId);
        List<ProjectRelationshipDO> relationshipDOS = projectRelationshipRepository.select(selectTmpDO);
        List<Map<String, Date>> list = new ArrayList<>();
        //去除已与当前项目群建立的关系
        relationshipDOS = relationshipDOS.stream().filter(r -> !r.getParentId().equals(parentId)).collect(Collectors.toList());
        relationshipDOS.forEach(r -> {
            ProjectDO projectDO = projectRepository.selectByPrimaryKey(r.getParentId());
            if (projectDO != null &&
                    projectDO.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
                    r.getEnabled()) {
                Map<String, Date> map = new HashMap<>();
                map.put("start", r.getStartDate());
                map.put("end", r.getEndDate());
                list.add(map);
            }

        });
        return list;
    }

    @Saga(code = PROJECT_RELATIONSHIP_ADD, description = "iam组合项目中新增子项目", inputSchemaClass = ProjectRelationshipInsertPayload.class)
    @Override
    @Transactional
    public List<ProjectRelationshipDTO> batchUpdateRelationShipUnderProgram(Long orgId, List<ProjectRelationshipDTO> list) {
        //check list
        if (CollectionUtils.isEmpty(list)) {
            logger.info("The array for batch update relationships cannot be empty");
            return Collections.emptyList();
        }
        checkUpdateList(list);
        //update与create分区
        List<ProjectRelationshipDTO> updateNewList = new ArrayList<>();
        List<ProjectRelationshipDTO> insertNewList = new ArrayList<>();
        list.forEach(g -> {
            if (g.getId() == null) {
                insertNewList.add(g);
            } else {
                updateNewList.add(g);
            }
        });
        List<ProjectRelationshipDTO> returnList = new ArrayList<>();
        // build project relationship saga payload
        ProjectRelationshipInsertPayload sagaPayload = new ProjectRelationshipInsertPayload();
        ProjectDO parent = projectRepository.selectByPrimaryKey(list.get(0).getParentId());
        sagaPayload.setCategory(parent.getCategory());
        sagaPayload.setParentCode(parent.getCode());
        sagaPayload.setParentId(parent.getId());
        List<ProjectRelationshipInsertPayload.ProjectRelationship> relationships = new ArrayList<>();
        //批量插入
        insertNewList.forEach(relationshipDTO -> {
            checkGroupIsLegal(relationshipDTO);
            if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                    .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                relationshipDTO.setProgramId(relationshipDTO.getParentId());
            }
            ProjectRelationshipDO checkDO = new ProjectRelationshipDO();
            checkDO.setParentId(relationshipDTO.getParentId());
            checkDO.setProjectId(relationshipDTO.getProjectId());
            if (projectRelationshipRepository.selectOne(checkDO) != null) {
                throw new CommonException("error.relationship.exist");
            }
            // check date
            if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                    .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                ProjectRelationshipDO relationshipDO = new ProjectRelationshipDO();
                BeanUtils.copyProperties(relationshipDTO, relationshipDO);
                RelationshipCheckDTO relationshipCheckDTO = checkDate(relationshipDO);
                if (!relationshipCheckDTO.getResult()) {
                    throw new CommonException("error.relationship.date.is.not.legal");
                }
            }

            // insert
            BeanUtils.copyProperties(projectRelationshipRepository.addProjToGroup(relationshipDTO), relationshipDTO);
            returnList.add(relationshipDTO);
            // fill the saga payload
            ProjectDO project = projectRepository.selectByPrimaryKey(relationshipDTO.getProjectId());
            ProjectRelationshipInsertPayload.ProjectRelationship relationship
                    = new ProjectRelationshipInsertPayload.ProjectRelationship(project.getId(), project.getCode(),
                    relationshipDTO.getStartDate(), relationshipDTO.getEndDate(), relationshipDTO.getEnabled());
            relationships.add(relationship);
        });
        //批量更新
        updateNewList.forEach(relationshipDTO -> {
            checkGroupIsLegal(relationshipDTO);
            if (projectRelationshipRepository.selectByPrimaryKey(relationshipDTO.getId()) == null) {
                logger.warn("Batch update project relationship exists Nonexistent relationship,id is{}:{}", relationshipDTO.getId(), relationshipDTO);
            } else {
                if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                        .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                    relationshipDTO.setProgramId(relationshipDTO.getParentId());
                }
                ProjectRelationshipDO projectRelationshipDO = new ProjectRelationshipDO();
                BeanUtils.copyProperties(relationshipDTO, projectRelationshipDO);
                // check date
                if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                        .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                    RelationshipCheckDTO relationshipCheckDTO = checkDate(projectRelationshipDO);
                    if (!relationshipCheckDTO.getResult()) {
                        throw new CommonException("error.relationship.date.is.not.legal");
                    }
                }
                // update
                projectRelationshipDO = projectRelationshipRepository.update(projectRelationshipDO);
                BeanUtils.copyProperties(projectRelationshipDO, relationshipDTO);
                returnList.add(relationshipDTO);
            }
        });
        try {
            sagaPayload.setRelationships(relationships);
            String input = mapper.writeValueAsString(sagaPayload);
            sagaClient.startSaga(PROJECT_RELATIONSHIP_ADD, new StartInstanceDTO(input, "organization", "" + orgId, ResourceLevel.ORGANIZATION.value(), orgId));
        } catch (Exception e) {
            throw new CommonException("error.project.relationship.add.event", e);
        }
        return returnList;
    }

    /**
     * 校验批量更新DTO
     * 检验不能为空
     * 校验结束时间不能早于开始时间
     * 校验不能批量更新不同项目群下的项目关系
     *
     * @param list
     */
    private void checkUpdateList(List<ProjectRelationshipDTO> list) {
        //list不能为空
        if (list == null || list.isEmpty()) {
            logger.info("The array for batch update relationships cannot be empty");
            return;
        }
        list.forEach(r -> {
            //开始时间为空则填充为当前时间
            if (r.getStartDate() == null) {
                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                try {
                    r.setStartDate(simpleDateFormat.parse(simpleDateFormat.format(new Date())));
                } catch (ParseException e) {
                    logger.info("Relationship start time format failed");
                }
            }
            //结束时间不能早于开始时间
            if (r.getStartDate() != null && r.getEndDate() != null && r.getStartDate().getTime() > r.getEndDate().getTime()) {
                throw new CommonException("error.update.project.relationship.endDate.before.startDate");
            }
        });

        Set<Long> collect = list.stream().map(ProjectRelationshipDTO::getParentId).collect(Collectors.toSet());
        if (collect.size() != 1) {
            throw new CommonException("error.update.project.relationships.must.be.under.the.same.program");
        }
    }

    /**
     * 校验
     * 校验parent是否为空，是否非敏捷项目
     * 校验project是否为空，是否为敏捷项目
     *
     * @param projectRelationshipDTO
     */
    private void checkGroupIsLegal(ProjectRelationshipDTO projectRelationshipDTO) {
        ProjectDO parent = projectRepository.selectByPrimaryKey(projectRelationshipDTO.getParentId());
        if (parent == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        }
        if (!parent.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
                !parent.getCategory().equalsIgnoreCase(ProjectCategory.ANALYTICAL.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }

        ProjectDO son = projectRepository.selectByPrimaryKey(projectRelationshipDTO.getProjectId());
        if (son == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (!son.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(PROGRAM_CANNOT_BE_CONFIGURA_SUBPROJECTS);
        }
    }

    private RelationshipCheckDTO checkDate(ProjectRelationshipDO needCheckDO) {
        // db list
        ProjectRelationshipDO checkDO = new ProjectRelationshipDO();
        checkDO.setProjectId(needCheckDO.getProjectId());
        List<ProjectRelationshipDO> dbList = projectRelationshipRepository.select(checkDO);

        long start = needCheckDO.getStartDate().getTime();
        // build result
        RelationshipCheckDTO result = new RelationshipCheckDTO();
        result.setResult(true);

        // check
        dbList.forEach(r -> {
            ProjectDO parent = projectRepository.selectByPrimaryKey(r.getParentId());
            if (r.getId() != needCheckDO.getId() && r.getEnabled()
                    && parent.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                long min = r.getStartDate().getTime();
                Boolean flag = true;
                if (needCheckDO.getEndDate() != null) {
                    long end = needCheckDO.getEndDate().getTime();
                    if (r.getEndDate() != null) {
                        long max = r.getEndDate().getTime();
                        if (!(start >= max || end <= min)) {
                            flag = false;
                        }
                    } else {
                        if (end > min) {
                            flag = false;
                        }
                    }
                } else {
                    if (r.getEndDate() != null) {
                        long max = r.getEndDate().getTime();
                        if (start < max) {
                            flag = false;
                        }
                    } else {
                        flag = false;
                    }
                }
                if (!flag) {
                    result.setResult(false);
                    result.setProjectCode(parent.getCode());
                    result.setProjectName(parent.getName());
                    logger.warn("Project associated time is not legal,relationship:{},conflict project name:{},code:{}",
                            needCheckDO, result.getProjectName(), result.getProjectCode());
                    return;
                }
            }
        });
        // return
        return result;
    }
}
