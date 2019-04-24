package io.choerodon.iam.app.service.impl;

import static io.choerodon.iam.infra.common.utils.SagaTopic.ProjectRelationship.PROJECT_RELATIONSHIP_ADD;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.choerodon.iam.infra.dto.ProjectDTO;
import io.choerodon.iam.infra.dto.ProjectRelationshipDTO;
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
import io.choerodon.iam.api.dto.RelationshipCheckDTO;
import io.choerodon.iam.api.dto.payload.ProjectRelationshipInsertPayload;
import io.choerodon.iam.app.service.ProjectRelationshipService;
import io.choerodon.iam.domain.repository.ProjectRelationshipRepository;
import io.choerodon.iam.domain.repository.ProjectRepository;
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
        ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(projectId);
        if (projectDTO == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        }
        if (!projectDTO.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
                !projectDTO.getCategory().equalsIgnoreCase(ProjectCategory.ANALYTICAL.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }
        return projectRelationshipRepository.seleteProjectsByParentId(projectId);
    }

    @Override
    public void removesAProjUnderGroup(Long groupId) {
        ProjectRelationshipDTO projectRelationshipDTO = projectRelationshipRepository.selectByPrimaryKey(groupId);
        if (projectRelationshipDTO == null) {
            throw new CommonException(RELATIONSHIP_NOT_EXIST_EXCEPTION);
        }
        projectRelationshipRepository.deleteGroup(groupId);
    }

    @Override
    public RelationshipCheckDTO checkRelationshipCanBeEnabled(Long id) {
        ProjectRelationshipDTO projectRelationshipDTO = projectRelationshipRepository.selectByPrimaryKey(id);
        if (projectRelationshipDTO == null) {
            throw new CommonException(RELATIONSHIP_NOT_EXIST_EXCEPTION);
        } else if (projectRelationshipDTO.getEnabled()) {
            throw new CommonException("error.check.relationship.is.already.enabled");
        }
        return checkDate(projectRelationshipDTO);
    }

    @Override
    public List<Map<String, Date>> getUnavailableTime(Long projectId, Long parentId) {
        ProjectDTO project = projectRepository.selectByPrimaryKey(projectId);
        if (project == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (!project.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(PROGRAM_CANNOT_BE_CONFIGURA_SUBPROJECTS);
        }
        ProjectDTO parent = projectRepository.selectByPrimaryKey(parentId);
        if (parent == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (parent.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }
        //查询projectId所有被建立的关系
        ProjectRelationshipDTO selectTmpDTO = new ProjectRelationshipDTO();
        selectTmpDTO.setProjectId(projectId);
        List<ProjectRelationshipDTO> relationshipDOS = projectRelationshipRepository.select(selectTmpDTO);
        List<Map<String, Date>> list = new ArrayList<>();
        //去除已与当前项目群建立的关系
        relationshipDOS = relationshipDOS.stream().filter(r -> !r.getParentId().equals(parentId)).collect(Collectors.toList());
        relationshipDOS.forEach(r -> {
            ProjectDTO projectDTO = projectRepository.selectByPrimaryKey(r.getParentId());
            if (projectDTO != null &&
                    projectDTO.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
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
        ProjectDTO parent = projectRepository.selectByPrimaryKey(list.get(0).getParentId());
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
            ProjectRelationshipDTO checkDTO = new ProjectRelationshipDTO();
            checkDTO.setParentId(relationshipDTO.getParentId());
            checkDTO.setProjectId(relationshipDTO.getProjectId());
            if (projectRelationshipRepository.selectOne(checkDTO) != null) {
                throw new CommonException("error.relationship.exist");
            }
            // check date
            if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                    .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                ProjectRelationshipDTO dto = new ProjectRelationshipDTO();
                BeanUtils.copyProperties(relationshipDTO, dto);
                RelationshipCheckDTO relationshipCheckDTO = checkDate(dto);
                if (!relationshipCheckDTO.getResult()) {
                    throw new CommonException("error.relationship.date.is.not.legal");
                }
            }

            // insert
            BeanUtils.copyProperties(projectRelationshipRepository.addProjToGroup(relationshipDTO), relationshipDTO);
            returnList.add(relationshipDTO);
            // fill the saga payload
            ProjectDTO project = projectRepository.selectByPrimaryKey(relationshipDTO.getProjectId());
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
                // check date
                if (projectRepository.selectByPrimaryKey(relationshipDTO.getParentId()).getCategory()
                        .equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                    RelationshipCheckDTO relationshipCheckDTO = checkDate(relationshipDTO);
                    if (!relationshipCheckDTO.getResult()) {
                        throw new CommonException("error.relationship.date.is.not.legal");
                    }
                }
                // update
                relationshipDTO = projectRelationshipRepository.update(relationshipDTO);
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
        ProjectDTO parent = projectRepository.selectByPrimaryKey(projectRelationshipDTO.getParentId());
        if (parent == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        }
        if (!parent.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value()) &&
                !parent.getCategory().equalsIgnoreCase(ProjectCategory.ANALYTICAL.value())) {
            throw new CommonException(AGILE_CANNOT_CONFIGURA_SUBPROJECTS);
        }

        ProjectDTO son = projectRepository.selectByPrimaryKey(projectRelationshipDTO.getProjectId());
        if (son == null) {
            throw new CommonException(PROJECT_NOT_EXIST_EXCEPTION);
        } else if (!son.getCategory().equalsIgnoreCase(ProjectCategory.AGILE.value())) {
            throw new CommonException(PROGRAM_CANNOT_BE_CONFIGURA_SUBPROJECTS);
        }
    }

    private RelationshipCheckDTO checkDate(ProjectRelationshipDTO needCheckDTO) {
        // db list
        ProjectRelationshipDTO checkDTO = new ProjectRelationshipDTO();
        checkDTO.setProjectId(needCheckDTO.getProjectId());
        List<ProjectRelationshipDTO> dbList = projectRelationshipRepository.select(checkDTO);

        long start = needCheckDTO.getStartDate().getTime();
        // build result
        RelationshipCheckDTO result = new RelationshipCheckDTO();
        result.setResult(true);

        // check
        dbList.forEach(r -> {
            ProjectDTO parent = projectRepository.selectByPrimaryKey(r.getParentId());
            if (!r.getId().equals(needCheckDTO.getId()) && r.getEnabled()
                    && parent.getCategory().equalsIgnoreCase(ProjectCategory.PROGRAM.value())) {
                long min = r.getStartDate().getTime();
                Boolean flag = true;
                if (needCheckDTO.getEndDate() != null) {
                    long end = needCheckDTO.getEndDate().getTime();
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
                            needCheckDTO, result.getProjectName(), result.getProjectCode());
                    return;
                }
            }
        });
        // return
        return result;
    }
}
