package com.storemanagement.StoreManagement.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class ImageHandler {
    
    @Value("${product.image.upload-dir}")
    private String uploadDir;
    
    public String saveImage(MultipartFile image) throws IOException {
        Files.createDirectories(Paths.get(uploadDir)); // Garante que o diretório existe
        
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename(); // Evita nomes duplicados
        File dest = new File(uploadDir, fileName);
        image.transferTo(dest);
        
        return fileName;
    }
}
