package com.fieldsync.repository;

import com.fieldsync.entity.AppUser;
import com.fieldsync.enums.AccountStatus;
import com.fieldsync.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    List<AppUser> findByRole(Role role);

    List<AppUser> findByRoleAndAccountStatus(Role role, AccountStatus accountStatus);

    long countByRole(Role role);
}
