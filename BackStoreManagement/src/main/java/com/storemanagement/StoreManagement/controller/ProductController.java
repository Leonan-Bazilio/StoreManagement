package com.storemanagement.StoreManagement.controller;

import com.storemanagement.StoreManagement.dto.ProductDTO;
import com.storemanagement.StoreManagement.entity.Product;
import com.storemanagement.StoreManagement.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") ProductDTO product,
            @RequestPart("image") MultipartFile image) throws IOException {
        Product savedProduct = productService.createProduct(product, image);
        return ResponseEntity.status(201).body(savedProduct);
    }
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductDTO product,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        Product updatedProduct = productService.updateProduct(id, product, image);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Product> addQuantityInStock(
            @PathVariable Long id, @RequestBody Map<String, Integer> request) {
        Integer quantityToAdd = request.get("quantityToAdd");
        Product updatedProduct = productService.addQuantityInStock(id, quantityToAdd);
        return ResponseEntity.ok(updatedProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
