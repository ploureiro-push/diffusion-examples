/**
 * Copyright © 2024 DiffusionData Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This example is written in C99. Please use an appropriate C99 capable compiler
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "diffusion.h"
#include "utils.h"
MUTEX_DEF

static int on_system_authentication_store_updated(
    SESSION_T *session,
    const LIST_T *error_report,
    void *context)
{
    MUTEX_BROADCAST
    return HANDLER_SUCCESS;
}

static int on_error(
    SESSION_T *session,
    const DIFFUSION_ERROR_T *error)
{
    printf("On error: %s\n", error->message);
    return HANDLER_SUCCESS;
}



void run_example(
    const char *url,
    const char *principal,
    CREDENTIALS_T *credentials)
{
    MUTEX_INIT

    SESSION_T *session = utils_open_session(url, "admin", "password");

    LIST_T *list_roles = list_create();
    list_append_last(list_roles, "ADMINISTRATOR");

    SCRIPT_T *add_script = script_create();
    update_auth_store_add_principal(
        add_script, "super_user", "password12345", list_roles
    );

    const UPDATE_SYSTEM_AUTHENTICATION_STORE_PARAMS_T add_params = {
        .on_update = on_system_authentication_store_updated,
        .on_error = on_error,
        .update_script = add_script
    };

    update_system_authentication_store(session, add_params);
    MUTEX_WAIT
    script_free(add_script);
    list_free(list_roles, NULL);

    SCRIPT_T *remove_script = script_create();
    update_auth_store_remove_principal(remove_script, "super_user");

    const UPDATE_SYSTEM_AUTHENTICATION_STORE_PARAMS_T remove_params = {
        .on_update = on_system_authentication_store_updated,
        .on_error = on_error,
        .update_script = remove_script
    };

    update_system_authentication_store(session, remove_params);
    MUTEX_WAIT
    script_free(remove_script);

    session_close(session, NULL);
    session_free(session);


    MUTEX_TERMINATE
}
