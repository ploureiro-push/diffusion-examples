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

static int on_topic_update(
    void *context)
{
    printf("Topic has been updated.\n");
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

static int on_topic_added(
    SESSION_T *session,
    TOPIC_ADD_RESULT_CODE result_code,
    void *context)
{
    if (result_code == TOPIC_ADD_RESULT_CREATED) {
        printf("Topic has been created.\n");
    }
    else if (result_code == TOPIC_ADD_RESULT_EXISTS) {
        printf("Topic already exists.\n");
    }
    MUTEX_BROADCAST
    return HANDLER_SUCCESS;
}

static int on_topic_add_failed_with_specification(
        SESSION_T *session,
        TOPIC_ADD_FAIL_RESULT_CODE result_code,
        const DIFFUSION_ERROR_T *error,
        void *context)
{
    printf("Topic creation failed: %d %d %s\n", result_code, error->code, error->message);
    return HANDLER_SUCCESS;
}


void run_example(
    const char *url,
    const char *principal,
    CREDENTIALS_T *credentials)
{
    MUTEX_INIT
    char *topic_path = "my/topic/path";

    SESSION_T *session = session_create(
        url, principal, credentials, NULL, NULL, NULL
    );

    TOPIC_SPECIFICATION_T *topic_specification = topic_specification_init(TOPIC_TYPE_JSON);
    ADD_TOPIC_CALLBACK_T create_topic_params = {
        .on_topic_added_with_specification = on_topic_added,
        .on_topic_add_failed_with_specification = on_topic_add_failed_with_specification,
        .on_error = on_error
    };
    add_topic_from_specification(
        session, topic_path, topic_specification, create_topic_params);
    MUTEX_WAIT
    topic_specification_free(topic_specification);

    DIFFUSION_TOPIC_UPDATE_CONSTRAINT_T *constraint =
        diffusion_topic_update_constraint_no_value();

    BUF_T *value = buf_create();
    write_diffusion_json_value("{\"diffusion\": [ \"data\", \"more data\" ] }", value);

    DIFFUSION_TOPIC_UPDATE_SET_PARAMS_T params = {
        .datatype = DATATYPE_JSON,
        .on_topic_update = on_topic_update,
        .topic_path = topic_path,
        .update = value,
        .on_error = on_error
    };

    diffusion_topic_update_set_with_constraint(session, constraint, params);
    MUTEX_WAIT

    session_close(session, NULL);
    session_free(session);
    diffusion_topic_update_constraint_free(constraint);
    buf_free(value);
    MUTEX_TERMINATE
}