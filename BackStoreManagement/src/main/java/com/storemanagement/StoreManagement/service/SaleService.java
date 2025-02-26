package com.storemanagement.StoreManagement.service;

import com.storemanagement.StoreManagement.dto.SaleDTO;
import com.storemanagement.StoreManagement.dto.SaleItemDTO;
import com.storemanagement.StoreManagement.entity.Product;
import com.storemanagement.StoreManagement.entity.Sale;
import com.storemanagement.StoreManagement.entity.SaleItem;
import com.storemanagement.StoreManagement.exception.BusinessException;
import com.storemanagement.StoreManagement.repository.ProductRepository;
import com.storemanagement.StoreManagement.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public Sale createSale(SaleDTO saleDTO) {
        Sale sale = new Sale();
        sale.setDiscount(saleDTO.getDiscount());
        sale.setSaleDate(saleDTO.getSaleDate());
        
        List<SaleItem> saleItems = new ArrayList<>();
        
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new BusinessException("Produto não encontrado"));
            
            if (product.getQuantityInStock() < itemDTO.getQuantity()) {
                throw new BusinessException("Estoque insuficiente para o produto: " + product.getName());
            }
            
            product.setQuantityInStock(product.getQuantityInStock() - itemDTO.getQuantity());
            productRepository.save(product);
            
            SaleItem saleItem = new SaleItem();
            saleItem.setSale(sale);
            saleItem.setProductId(itemDTO.getProductId());
            saleItem.setQuantity(itemDTO.getQuantity());
            saleItem.setCostPriceAtSale(product.getCostPrice());
            saleItem.setSellingPriceAtSale(product.getSellingPrice());
            saleItem.setProductNameAtSale(product.getName());
            saleItem.setProductDescriptionAtSale(product.getDescription());
            saleItem.setImagePath(product.getImagePath());
            
            saleItems.add(saleItem);
        }
        
        sale.setItems(saleItems);
        return saleRepository.save(sale);
    }
    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Venda não encontrada"));
    }
    
    @Transactional
    public void deleteSale(Long id) {
        if (!saleRepository.existsById(id)) {
            throw new BusinessException("Venda não encontrada");
        }
        saleRepository.deleteById(id);
    }
}
