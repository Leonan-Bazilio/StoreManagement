package com.storemanagement.StoreManagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@Data
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleItem> items = new ArrayList<>();
    
    private BigDecimal discount;
    private LocalDateTime saleDate;
    
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    public Sale() {
        this.createdAt = LocalDateTime.now();
        this.saleDate = LocalDateTime.now();
    }
    
    public Sale(BigDecimal discount) {
        this.discount = discount;
        this.saleDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
    }
    
    public void addItem(SaleItem item) {
        this.items.add(item);
        item.setSale(this);
    }
    
    public void removeItem(SaleItem item) {
        this.items.remove(item);
        item.setSale(null);
    }
    
}
