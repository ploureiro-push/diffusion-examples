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
package com.pushtechnology.client.sdk.example.serverconfiguration.securitycontrol;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.clients.SystemAuthenticationControl;
import com.pushtechnology.diffusion.client.session.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class SystemAuthenticationControlExample {

    private static final Logger LOG = LoggerFactory.getLogger(
        SystemAuthenticationControlExample.class);

    public static void main(String[] args) {
        Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");


        final SystemAuthenticationControl authenticationControl =
            session.feature(SystemAuthenticationControl.class);

        System.out.println(authenticationControl.getSystemAuthentication().join());
        System.out.println("Creating new principal and denying anonymous connections");

        Set<String> roles = new HashSet<String>(){{
            add("CLIENT_CONTROL");
            add("TOPIC_CONTROL");
            add("AUTHENTICATION_HANDLER");
        }};

        authenticationControl.updateStore(
            authenticationControl.scriptBuilder()
                .addPrincipal("observer", "password", roles)
                .denyAnonymousConnections()
                .script()
        ).join();

        System.out.println(authenticationControl.getSystemAuthentication().join());
        System.out.println("Adding ADMINISTRATOR roles to observer principal and setting" +
            "allowed client properties");

        Set<String> myProperties = new HashSet<String>(){{
            add("macbook");
            add("dell");
            add("lenovo");
        }};

        authenticationControl.updateStore(
            authenticationControl.scriptBuilder()
                .assignRoles("observer", Collections.singleton("ADMINISTRATOR"))
                .trustClientProposedPropertyIn("laptop", myProperties)
                .ignoreClientProposedProperty("calculator")
                .script()
        ).join();

        System.out.println(authenticationControl.getSystemAuthentication().join());
        System.out.println("removing observer principal and allowing anonymous connections as CLIENT");

        authenticationControl.updateStore(
            authenticationControl.scriptBuilder()
                .removePrincipal("observer")
                .allowAnonymousConnections(Collections.singleton("CLIENT"))
                .script()
        ).join();

        System.out.println(authenticationControl.getSystemAuthentication().join());
        session.close();

        LOG.info(session.getState().toString());
    }
}
