package com.storemanagement.StoreManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleDTO {
    private List<SaleItemDTO> items;
    private BigDecimal discount;
    private LocalDateTime saleDate;
}
