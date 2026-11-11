#include "coordinator.h"
#include "utils.h"


COORDINATOR_T *coordinator_init(void)
{
    COORDINATOR_T *result = calloc(1, sizeof(COORDINATOR_T));
    apr_initialize();
    apr_pool_create(&result->pool, NULL);
    apr_thread_mutex_create(&result->mutex, APR_THREAD_MUTEX_NESTED, result->pool);
    apr_thread_cond_create(&result->cond, result->pool);
    apr_atomic_set32(&result->flag, 0);
    result->timeout = 5000;
    result->value = NULL;
    result->response = NULL;
    return result;
}


void coordinator_free(COORDINATOR_T *coordinator)
{
    if (coordinator == NULL) {
        return;
    }
    apr_thread_mutex_destroy(coordinator->mutex);
    apr_thread_cond_destroy(coordinator->cond);
    apr_pool_destroy(coordinator->pool);
    apr_terminate();

    // value and response allocation resposibility is of who made them
    free(coordinator);
}


void coordinator_wait(COORDINATOR_T *coordinator)
{
    if (coordinator == NULL) {
        return;
    }
    apr_time_t deadline = apr_time_now() + apr_time_from_msec(coordinator->timeout);
    apr_thread_mutex_lock(coordinator->mutex);
    while (apr_atomic_read32(&coordinator->flag) == 0) {
        apr_interval_time_t remaining = deadline - apr_time_now();
        apr_status_t rv = APR_TIMEUP;
        if (remaining > 0) {
            rv = apr_thread_cond_timedwait(coordinator->cond, coordinator->mutex, remaining);
        }
        if (rv != APR_SUCCESS && apr_atomic_read32(&coordinator->flag) == 0) {
            LOG("Waiting expired.");
            exit(1);
        }
    }
    apr_atomic_set32(&coordinator->flag, 0);
    apr_thread_mutex_unlock(coordinator->mutex);
}


void coordinator_broadcast(COORDINATOR_T *coordinator)
{
    if (coordinator == NULL) {
        return;
    }
    apr_thread_mutex_lock(coordinator->mutex);
    apr_atomic_set32(&coordinator->flag, 1);
    apr_thread_cond_broadcast(coordinator->cond);
    apr_thread_mutex_unlock(coordinator->mutex);
}

