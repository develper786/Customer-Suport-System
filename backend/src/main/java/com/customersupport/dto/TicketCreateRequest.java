package com.customersupport.dto;

public class TicketCreateRequest {
    private String title;

    private String description;
    private String priority = "MEDIUM";
    private String category = "GENERAL";
    private String customerName;
    private String customerEmail;

    public TicketCreateRequest() {}

    public TicketCreateRequest(String title, String description, String priority, String category, String customerName, String customerEmail) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.category = category;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
