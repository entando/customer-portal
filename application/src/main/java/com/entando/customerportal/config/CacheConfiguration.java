package com.entando.customerportal.config;

import com.github.benmanes.caffeine.jcache.configuration.CaffeineConfiguration;
import java.util.OptionalLong;
import java.util.concurrent.TimeUnit;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Caffeine caffeine = jHipsterProperties.getCache().getCaffeine();

        CaffeineConfiguration caffeineConfiguration = new CaffeineConfiguration();
        caffeineConfiguration.setMaximumSize(OptionalLong.of(caffeine.getMaxEntries()));
        caffeineConfiguration.setExpireAfterWrite(OptionalLong.of(TimeUnit.SECONDS.toNanos(caffeine.getTimeToLiveSeconds())));
        caffeineConfiguration.setStatisticsEnabled(true);
        jcacheConfiguration = caffeineConfiguration;
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, "oAuth2Authentication");
            createCache(cm, com.entando.customerportal.domain.Customer.class.getName());
            createCache(cm, com.entando.customerportal.domain.Customer.class.getName() + ".projects");
            createCache(cm, com.entando.customerportal.domain.Project.class.getName());
            createCache(cm, com.entando.customerportal.domain.Project.class.getName() + ".projectSubscriptions");
            createCache(cm, com.entando.customerportal.domain.Project.class.getName() + ".tickets");
            createCache(cm, com.entando.customerportal.domain.Project.class.getName() + ".partners");
            createCache(cm, com.entando.customerportal.domain.Project.class.getName() + ".portalUsers");
            createCache(cm, com.entando.customerportal.domain.EntandoVersion.class.getName());
            createCache(cm, com.entando.customerportal.domain.ProjectSubscription.class.getName());
            createCache(cm, com.entando.customerportal.domain.Partner.class.getName());
            createCache(cm, com.entando.customerportal.domain.Ticket.class.getName());
            createCache(cm, com.entando.customerportal.domain.TicketingSystem.class.getName());
            createCache(cm, com.entando.customerportal.domain.PortalUser.class.getName());
            createCache(cm, com.entando.customerportal.domain.Project.class.getName() + ".users");
            createCache(cm, com.entando.customerportal.domain.PortalUser.class.getName() + ".projects");
            // jhipster-needle-caffeine-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }
}
