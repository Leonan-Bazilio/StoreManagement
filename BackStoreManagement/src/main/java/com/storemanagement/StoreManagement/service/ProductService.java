package com.storemanagement.StoreManagement.service;

import com.storemanagement.StoreManagement.dto.ProductDTO;
import com.storemanagement.StoreManagement.entity.Product;
import com.storemanagement.StoreManagement.exception.BusinessException;
import com.storemanagement.StoreManagement.repository.ProductRepository;
import com.storemanagement.StoreManagement.utils.ImageHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ImageHandler imageHandler;
    
    @Transactional
    public Product createProduct(ProductDTO productDTO, MultipartFile image) throws IOException {
        
        Product product = updateDataProduct(new Product(),productDTO);
        String imagePath = imageHandler.saveImage(image);
        product.setImagePath(imagePath);
        return productRepository.save(product);
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Produto não encontrado"));
    }
    
    @Transactional
    public Product updateProduct(Long id, ProductDTO updatedProductDTO, MultipartFile image) throws IOException {
        Product existingProduct = updateDataProduct(getProductById(id),updatedProductDTO);
        
        if (image != null && !image.isEmpty()) {
            String imagePath = imageHandler.saveImage(image);
            existingProduct.setImagePath(imagePath);
        }
        
        return productRepository.save(existingProduct);
    }
    
    
    public Product updateDataProduct(Product product, ProductDTO productDTO){
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setCostPrice(productDTO.getCostPrice());
        product.setSellingPrice(productDTO.getSellingPrice());
        product.setQuantityInStock(productDTO.getQuantityInStock());
        product.setLowStockLimit(productDTO.getLowStockLimit());
        product.setCriticalStockLimit(productDTO.getCriticalStockLimit());
        return product;
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new BusinessException("Produto não encontrado");
        }
        productRepository.deleteById(id);
    }
    
    public Product addQuantityInStock(Long id, int quantityToAdd){
        Product product = getProductById(id);
        int updatedQuantity = product.getQuantityInStock()+quantityToAdd;
        product.setQuantityInStock(updatedQuantity);
        return product;
    }
}
