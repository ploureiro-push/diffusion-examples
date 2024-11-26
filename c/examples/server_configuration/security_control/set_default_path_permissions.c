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

static int on_security_store_updated(
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

    printf("Original Security Store Settings for role CLIENT\n");
    utils_print_security_store(session, "CLIENT");

    SET_T *set_permissions = set_new_int(2);
    set_add(set_permissions, &SECURITY_PATH_PERMISSIONS_TABLE[PATH_PERMISSION_UPDATE_TOPIC]);
    set_add(set_permissions, &SECURITY_PATH_PERMISSIONS_TABLE[PATH_PERMISSION_MODIFY_TOPIC]);

    SCRIPT_T *script = script_create();
    update_security_store_default_path_permissions(
        script, "CLIENT", set_permissions
    );

    const UPDATE_SECURITY_STORE_PARAMS_T params = {
        .on_update = on_security_store_updated,
        .on_error = on_error,
        .update_script = script
    };

    printf(
        "\nAdding the following permissions to the default path permisions of Role CLIENT: "
        "MODIFY_TOPIC and UPDATE_TOPIC.\n"
    );
    utils_print_script(script);

    update_security_store(session, params);
    MUTEX_WAIT
    script_free(script);
    set_free(set_permissions);

    printf("New Security Store settings for role CLIENT\n");
    utils_print_security_store(session, "CLIENT");


    session_close(session, NULL);
    session_free(session);

    MUTEX_TERMINATE
}
