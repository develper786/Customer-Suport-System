package com.customersupport.enums;

public enum TicketCategory {
    BILLING("Billing", "Billing and payment related issues"),
    TECHNICAL("Technical", "Technical issues and bugs"),
    ACCOUNT("Account", "Account management and access issues"),
    FEATURE_REQUEST("Feature Request", "Feature request or enhancement"),
    GENERAL("General", "General inquiry or other issues");

    private final String displayName;
    private final String description;

    TicketCategory(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
