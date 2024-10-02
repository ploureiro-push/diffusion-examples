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


void run_example(
    const char *url,
    const char *principal,
    CREDENTIALS_T *credentials)
{
    MUTEX_INIT
    SESSION_T *session = session_create(
        url, principal, credentials, NULL, NULL, NULL
    );

    utils_create_json_topic(
        session,
        "my/topic/path/original_cast",
        "[                          \
            \"Fred Flintstone\",    \
            \"Wilma Flintstone\",   \
            \"Barney Rubble\",      \
            \"Betty Rubble\"        \
        ]"
    );

    utils_create_json_topic(
        session,
        "my/topic/path/additional_cast/1",
        "\"Pebbles Flintstone\""
    );

    utils_create_json_topic(
        session,
        "my/topic/path/additional_cast/2",
        "\"Bamm-Bamm Rubble\""
    );

    const char *topic_selector = "?views//";
    VALUE_STREAM_T *value_stream_ptr =
        utils_subscribe(session, topic_selector, DATATYPE_JSON);

    utils_create_topic_view(
        session,
        "topic_view_1",
        "map my/topic/path/original_cast                    \
            to views/the_flintstones                        \
            insert my/topic/path/additional_cast/1 at /-    \
            insert my/topic/path/additional_cast/2 at /-"
    );

    // Sleep for a bit to see the notifications
    sleep(2);


    session_close(session, NULL);
    session_free(session);
    free(value_stream_ptr);
    MUTEX_TERMINATE
}