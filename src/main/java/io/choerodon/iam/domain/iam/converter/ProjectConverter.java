//package io.choerodon.iam.domain.iam.converter;
//
//import io.choerodon.core.convertor.ConvertorI;
//import io.choerodon.iam.api.dto.ProjectDTO;
//import io.choerodon.iam.domain.iam.entity.ProjectE;
//import io.choerodon.iam.infra.dataobject.ProjectDO;
//import org.springframework.beans.BeanUtils;
//import org.springframework.stereotype.Component;
//
///**
// * @author flyleft
// * @date 2018/3/22
// */
//@Component
//public class ProjectConverter implements ConvertorI<ProjectE, ProjectDO, ProjectDTO> {
//
//    @Override
//    public ProjectE dtoToEntity(ProjectDTO dto) {
//        ProjectE projectE = new ProjectE();
//        BeanUtils.copyProperties(dto, projectE);
//        return projectE;
//    }
//
//    @Override
//    public ProjectDTO entityToDto(ProjectE entity) {
//        ProjectDTO projectDTO = new ProjectDTO();
//        BeanUtils.copyProperties(entity, projectDTO);
//        return projectDTO;
//    }
//
//    @Override
//    public ProjectE doToEntity(ProjectDO dataObject) {
//        ProjectE projectE = new ProjectE();
//        BeanUtils.copyProperties(dataObject, projectE);
//        return projectE;
//    }
//
//    @Override
//    public ProjectDO entityToDo(ProjectE entity) {
//        ProjectDO projectDO = new ProjectDO();
//        BeanUtils.copyProperties(entity, projectDO);
//        return projectDO;
//    }
//
//    @Override
//    public ProjectDTO doToDto(ProjectDO dataObject) {
//        ProjectDTO projectDTO = new ProjectDTO();
//        BeanUtils.copyProperties(dataObject, projectDTO);
//        return projectDTO;
//    }
//
//    @Override
//    public ProjectDO dtoToDo(ProjectDTO dto) {
//        ProjectDO projectDO = new ProjectDO();
//        BeanUtils.copyProperties(dto, projectDO);
//        return projectDO;
//    }
//}
