package com.storemanagement.StoreManagement.service;

import com.storemanagement.StoreManagement.dto.SaleDTO;
import com.storemanagement.StoreManagement.dto.SaleItemDTO;
import com.storemanagement.StoreManagement.dto.SaleWithPricesDTO;
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
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    
    public List<SaleWithPricesDTO> getAllSalesWithPrice() {
        return saleRepository.findAll().stream().
                map(SaleWithPricesDTO::new).toList();
    }
    
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Venda não encontrada"));
    }
    
    
    @Transactional
    public Sale createSale(SaleDTO saleDTO) {
        Sale sale = new Sale();
        sale.setDiscount(saleDTO.getDiscount());
        if(saleDTO.getSaleDate()!=null){
            sale.setSaleDate(saleDTO.getSaleDate());
        }
        
        List<SaleItem> saleItems = new ArrayList<>();
        
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new BusinessException("Produto não encontrado"));
            
            
            productService.addQuantityInStock(product.getId(), -itemDTO.getQuantity());
            
            SaleItem saleItem = getSaleItem(itemDTO, sale, product);
            
            saleItems.add(saleItem);
        }
        
        sale.setItems(saleItems);
        return saleRepository.save(sale);
    }
    
    @Transactional
    public Sale updateSale(Long id,SaleDTO saleDTO) {
        Sale sale = saleRepository.findById(id).orElseThrow();
        sale.setDiscount(saleDTO.getDiscount());
        
        
        List<SaleItem> itemsToRemove = new ArrayList<>(sale.getItems());
        
        
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            
            SaleItem existingItem = sale.getItems().stream()
                    .filter(item -> Objects.equals(item.getProductId(), itemDTO.getProductId()))
                    .findFirst().orElse(null);
            
            if (existingItem != null) {
                if (existingItem.getQuantity() != itemDTO.getQuantity()) {
                    existingItem.setQuantity(itemDTO.getQuantity());
                    productService.addQuantityInStock(existingItem.getId(),
                            itemDTO.getQuantity()-existingItem.getQuantity());
                }
                itemsToRemove.remove(existingItem);
            } else {
                Product product = productRepository.findById(itemDTO.getProductId())
                        .orElseThrow(() -> new BusinessException("Produto não encontrado"));
                productService.addQuantityInStock(product.getId(), -itemDTO.getQuantity());
                SaleItem saleItem = getSaleItem(itemDTO, sale, product);
                
                sale.getItems().add(saleItem);
            }
        }
        itemsToRemove.forEach(item -> {
            sale.getItems().remove(item);
        });
        return saleRepository.save(sale);
    }
    
    private static SaleItem getSaleItem(SaleItemDTO itemDTO, Sale sale, Product product) {
        SaleItem saleItem = new SaleItem();
        saleItem.setSale(sale);
        saleItem.setProductId(itemDTO.getProductId());
        saleItem.setQuantity(itemDTO.getQuantity());
        saleItem.setCostPriceAtSale(product.getCostPrice());
        saleItem.setSellingPriceAtSale(product.getSellingPrice());
        saleItem.setProductNameAtSale(product.getName());
        saleItem.setProductDescriptionAtSale(product.getDescription());
        saleItem.setImagePath(product.getImagePath());
        return saleItem;
    }
    
    @Transactional
    public void deleteSale(Long id) {
        if (!saleRepository.existsById(id)) {
            throw new BusinessException("Venda não encontrada");
        }
        saleRepository.deleteById(id);
    }
}
