package com.storemanagement.StoreManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Entity
@Data
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("saleItemId")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonIgnore
    private Sale sale;
    
    private Long productId;
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

