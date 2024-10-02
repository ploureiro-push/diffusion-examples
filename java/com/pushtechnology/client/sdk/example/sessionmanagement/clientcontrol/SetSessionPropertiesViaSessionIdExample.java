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
package com.pushtechnology.client.sdk.example.sessionmanagement.clientcontrol;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.clients.ClientControl;
import com.pushtechnology.diffusion.client.session.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.Map;

public class SetSessionPropertiesViaSessionIdExample {

    private static final Logger LOG = LoggerFactory.getLogger(
        SetSessionPropertiesViaSessionIdExample.class);

    public static void main(String[] args) {

        Session adminSession = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        Session clientSession = Diffusion.sessions()
            .principal("client")
            .password("password")
            .open("ws://localhost:8080");

        ClientControl clientControl = adminSession.feature(ClientControl.class);
        Map<String, String> myProperties = Collections.singletonMap("$Country", "CA");

        Map<String, String> result = clientControl
            .setSessionProperties(clientSession.getSessionId(), myProperties).join();

        System.out.printf("Properties changed: %d", result.size());

        adminSession.close();
        clientSession.close();

        LOG.info("Properties changed: {}", result.size());
    }
}
