package com.storemanagement.StoreManagement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
    private BigDecimal costPrice;
    private BigDecimal sellingPrice;
    private int quantityInStock;
    private int lowStockLimit;
    private int criticalStockLimit;
    private String imagePath;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    public Product() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Product(String name, String description, BigDecimal costPrice, BigDecimal sellingPrice, int quantityInStock,
                   int lowStockLimit, int criticalStockLimit, String imagePath) {
        this.name = name;
        this.description = description;
        this.costPrice = costPrice;
        this.sellingPrice = sellingPrice;
        this.quantityInStock = quantityInStock;
        this.lowStockLimit = lowStockLimit;
        this.criticalStockLimit = criticalStockLimit;
        this.imagePath = imagePath;
        this.createdAt = LocalDateTime.now();
    }
    
}
