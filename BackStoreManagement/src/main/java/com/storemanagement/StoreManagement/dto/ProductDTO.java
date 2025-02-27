package com.storemanagement.StoreManagement.dto;

import lombok.*;

import java.math.BigDecimal;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private int quantityInStock;
    private int lowStockLimit;
    private int criticalStockLimit;
    private String imagePath;
}
