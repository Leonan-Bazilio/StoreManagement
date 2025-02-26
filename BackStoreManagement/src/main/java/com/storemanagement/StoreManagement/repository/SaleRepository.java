package com.storemanagement.StoreManagement.repository;

import com.storemanagement.StoreManagement.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
