package com.storemanagement.StoreManagement.repository;

import com.storemanagement.StoreManagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
