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
    DIFFUSION_ERROR_T error = { 0 };
    SESSION_T *session = session_create(
        url, principal, credentials, NULL, NULL, &error
    );
    if(session != NULL) {
        char *sid_str = session_id_to_string(session->id);
        printf("Connected. Session Identifier: %s\n", sid_str);
        free(sid_str);
    }
    else {
        printf("Failed to create session: %s\n", error.message);
        free(error.message);
    }

    // Insert work here

    session_close(session, NULL);
    session_free(session);
}