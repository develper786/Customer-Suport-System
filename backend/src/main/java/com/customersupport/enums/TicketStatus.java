package com.customersupport.enums;

public enum TicketStatus {
    OPEN("Open", "New ticket awaiting initial response"),
    AI_RESPONDED("AI Responded", "AI has provided an initial response"),
    PENDING_HUMAN("Pending Human", "Awaiting human agent response"),
    IN_PROGRESS("In Progress", "Being actively resolved by an agent"),
    RESOLVED("Resolved", "Issue has been resolved");

    private final String displayName;
    private final String description;

    TicketStatus(String displayName, String description) {
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
