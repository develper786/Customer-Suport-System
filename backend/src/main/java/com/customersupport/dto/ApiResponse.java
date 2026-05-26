package com.customersupport.dto;

public record ApiResponse<T>(boolean success, String message, T data) {
  public ApiResponse(boolean success, String message) {
    this(success, message, null);
  }
}
