package com.storemanagement.StoreManagement.dto;
import com.storemanagement.StoreManagement.entity.SaleItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItemWithPricesDTO {
    
    private Long productId;
    private int quantity;
    private BigDecimal costPriceAtSale;
    private BigDecimal sellingPriceAtSale;
    private String productNameAtSale;
    private String productDescriptionAtSale;
    private String imagePath;
    private Long saleItemId;
    private BigDecimal subTotal;
    
    public SaleItemWithPricesDTO(SaleItem saleItem){
        setProductId(saleItem.getProductId());
        setQuantity(saleItem.getQuantity());
        setCostPriceAtSale(saleItem.getCostPriceAtSale());
        setSellingPriceAtSale(saleItem.getSellingPriceAtSale());
        setProductNameAtSale(saleItem.getProductNameAtSale());
        setProductDescriptionAtSale(saleItem.getProductDescriptionAtSale());
        setImagePath(saleItem.getImagePath());
        setSaleItemId(saleItem.getId());
        setSubTotal();
    }
    
    public void setSubTotal() {
        this.subTotal = sellingPriceAtSale.multiply(BigDecimal.valueOf(quantity));
    }
}

