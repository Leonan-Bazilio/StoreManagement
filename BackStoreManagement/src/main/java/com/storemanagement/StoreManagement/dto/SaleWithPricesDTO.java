package com.storemanagement.StoreManagement.dto;

import com.storemanagement.StoreManagement.entity.Sale;
import com.storemanagement.StoreManagement.entity.SaleItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleWithPricesDTO {
    private Long saleId;
    private List<SaleItemWithPricesDTO> items;
    private BigDecimal discount;
    private LocalDateTime saleDate;
    private BigDecimal totalPrice;
    
    public SaleWithPricesDTO(Sale sale){
        setSaleId(sale.getId());
        setItems(sale.getItems());
        setDiscount(sale.getDiscount());
        setSaleDate(sale.getSaleDate());
        setTotalPrice();
    }
    
    public void setItems(List<SaleItem> pricelessItems){
        this.items = pricelessItems.stream().map(SaleItemWithPricesDTO::new).toList();
    }
    
    public void setTotalPrice(){
        this.totalPrice = this.items.stream()
                .map(SaleItemWithPricesDTO::getSubTotal)
                .reduce(BigDecimal.ZERO,BigDecimal::add).subtract(discount);
    }
}
