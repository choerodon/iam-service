package io.choerodon.iam.api.dto;

import java.util.Collections;
import java.util.List;

/**
 * @author dengyouquan
 **/
public class OrganizationProjectDTO {
    private List<Organization> organizationList = Collections.emptyList();
    private List<Project> projectList = Collections.emptyList();

    public List<Organization> getOrganizationList() {
        return organizationList;
    }

    public void setOrganizationList(List<Organization> organizationList) {
        this.organizationList = organizationList;
    }

    public List<Project> getProjectList() {
        return projectList;
    }

    public void setProjectList(List<Project> projectList) {
        this.projectList = projectList;
    }

    public static Organization newInstanceOrganization(Long id, String name, String code) {
        return new Organization(id, name, code);
    }

    public static Project newInstanceProject(Long id, String name, String code) {
        return new Project(id, name, code);
    }

    public static class Organization {
        private Long id;
        private String name;
        private String code;

        public Organization(Long id, String name, String code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }

        //feign需要默认构造方法，以便反序列化
        public Organization() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    public static class Project {
        private Long id;
        private String name;
        private String code;

        public Project(Long id, String name, String code) {
            this.id = id;
            this.name = name;
            this.code = code;
        }

        //feign需要默认参数，以便反序列化
        public Project() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}
