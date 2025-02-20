package com.storemanagement.StoreManagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Entity
@Getter
@Setter
@Data
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;
    
    private int quantity;
    private BigDecimal costPriceAtSale;
    private BigDecimal sellingPriceAtSale;
    private String productNameAtSale;
    private String productDescriptionAtSale;
    private String imagePath;
    
    public SaleItem() {}
    
    public SaleItem(int quantity, BigDecimal costPriceAtSale, BigDecimal sellingPriceAtSale,
                    String productNameAtSale, String productDescriptionAtSale, String imagePath) {
        this.quantity = quantity;
        this.costPriceAtSale = costPriceAtSale;
        this.sellingPriceAtSale = sellingPriceAtSale;
        this.productNameAtSale = productNameAtSale;
        this.productDescriptionAtSale = productDescriptionAtSale;
        this.imagePath = imagePath;
    }
    
    
   
}

