package com.Agora.Agora.Repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.Agora.Agora.Model.Enums.ItemCondition;
import com.Agora.Agora.Model.Listings;

import jakarta.persistence.criteria.Predicate;

public class ListingSearchRepo {

    // keyword searching.
    public static Specification<Listings> searchByKeyword(String keyword) {
        return ((root, cq, cb) -> {
            if (keyword == null || keyword.isEmpty()) {
                return null;
            }
            String pattern = "%" + keyword.toLowerCase() + "%";

            return cb.or(cb.like(root.get("title"), pattern),
                    cb.like(root.get("category"), pattern),
                    cb.like(root.get("condition"), pattern));
        });
    }

    // Searching by title.
    public static Specification<Listings> searchByTitle(String title) {
        return ((root, cq, cb) -> {
            if (title == null || title.isEmpty()) {
                return null;
            }

            return cb.like(cb.lower(root.get(title)),
                    "%" + title.toLowerCase() + "%");
        });
    }

    // Searching by category.
    public static Specification<Listings> searchByCategory(String category) {
        return ((root, cq, cb) -> {
            if (category == null || category.isEmpty()) {
                return null;
            }

            String pattern = "%" + category.toLowerCase() + "%";

            return cb.like(root.get(category), pattern);
        });

    }

    // Searching by min and max price;
    public static Specification<Listings> searchByPrice(BigDecimal minPrice, BigDecimal maxPrice) {
        return ((root, cq, cb) -> {
            Predicate predicate = cb.conjunction();

            if (minPrice != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return predicate;
        });
    }

    // Searching by Condition.
    public static Specification<Listings> searchByCondition(ItemCondition condition) {
        return (((root, cq, cb) -> {
            if (condition == null) {
                return null;
            }

            String pattern = "%" + condition.name().toLowerCase() + "%";

            return cb.like(root.get("condition"), pattern);
        }));
    }

    // Searching by collegeId.
    public static Specification<Listings> searchByCollegeId(Long collegeId) {
        return (root, cq, cb) -> {
            if (collegeId == null) {
                return null;
            }

            return cb.equal(root.get("college").get("id"), collegeId);
        };
    }

    // Searching by College Name.
    public static Specification<Listings> searchByCollegeName(String collegeName) {
        return ((root, cq, cb) -> {
            if (collegeName == null || collegeName.isEmpty()) {
                return null;
            }

            String pattern = "%" + collegeName.toLowerCase() + "%";

            return cb.equal(root.get("collegeName"), pattern);
        });
    }
}
