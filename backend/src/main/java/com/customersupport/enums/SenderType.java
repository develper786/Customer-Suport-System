package com.customersupport.enums;

public enum SenderType {
    CUSTOMER("customer", "Customer/End user"),
    AGENT("agent", "Support agent"),
    AI("ai", "AI system response");

    private final String value;
    private final String description;

    SenderType(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }

    public static SenderType fromValue(String value) {
        for (SenderType type : SenderType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid sender type: " + value);
    }
}
