/*******************************************************************************
 * Copyright (C) 2023 - 2024 DiffusionData Ltd.
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
 *******************************************************************************/
package com.pushtechnology.client.sdk.example.connection.establishment;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.session.SessionFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ConnectViaSessionFactoryExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(ConnectViaSessionFactoryExample.class);

    public static void main(String[] args) {

        final SessionFactory sessionFactory = Diffusion.sessions();

        sessionFactory
            .principal("admin")
            .password("password");

        final Session session = sessionFactory.open("ws://localhost:8080");
        System.out.printf("Connected with id: %s\n", session.getSessionId());

        // Insert work here

        session.close();

        LOG.info("session state: {}", session.getState());
    }
}
