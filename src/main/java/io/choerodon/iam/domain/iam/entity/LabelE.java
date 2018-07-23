package io.choerodon.iam.domain.iam.entity;

/**
 * @author superlee
 */
public class LabelE {
    private Long id;

    private String name;

    private String type;

    private String level;

    private String description;

    private Long objectVersionNumber;

    public LabelE(Long id, String name, String type, Long objectVersionNumber) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.objectVersionNumber = objectVersionNumber;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
