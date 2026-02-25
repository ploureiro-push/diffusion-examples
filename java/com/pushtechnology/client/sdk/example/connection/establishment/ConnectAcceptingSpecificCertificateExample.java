/*******************************************************************************
 * Copyright (C) 2023 - 2026 DiffusionData Ltd.
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

import java.io.ByteArrayInputStream;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.session.Session;

/**
 * This example demonstrates how to establish a secure connection while accepting a specific certificate.
 * <P>
 * A custom trust manager is implemented to verify the server certificate against the expected
 * certificate.
 * An SSL context is created and configured with the trust manager before opening a secure session.
 * @author DiffusionData Limited
 */
public class ConnectAcceptingSpecificCertificateExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(ConnectAcceptingSpecificCertificateExample.class);

    public static void main(String[] args) throws Exception {

        final SSLContext sslContext = SSLContext.getInstance("TLS");
        sslContext.init(
            null,
            new TrustManager[] {
                new X509TrustManager() {
                    @Override
                    public void checkServerTrusted(X509Certificate[] certs, String authType)
                        throws CertificateException {

                        if (certs == null || certs.length == 0) {
                            throw new CertificateException("Empty certificate chain");
                        }

                        final X509Certificate serverCert = certs[0];

                        serverCert.checkValidity();

                        if (!Arrays.equals(serverCert.getEncoded(), EXPECTED_BYTES)) {
                            throw new CertificateException("Server certificate does not match expected certificate");
                        }
                    }
                    @Override
                    public void checkClientTrusted(X509Certificate[] certs, String authType) { }
                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                }
            },
            null);

        final Session session = Diffusion.sessions()
            .secureTransport(true)
            .sslContext(sslContext)
            .principal("admin")
            .password("password")
            .open("wss://localhost:8080");

        LOG.info("Connected, session identifier: '{}'.", session.getSessionId());

        // Insert work here

        session.close();
    }

    // Default Diffusion development certificate. DO NOT USE IN PRODUCTION.
    private static final String SAMPLE_CRT = "-----BEGIN CERTIFICATE-----\n" +
        "MIIDyzCCArOgAwIBAgIUWl8OpLs8ZcsPq0NNetskZCA7FN0wDQYJKoZIhvcNAQEL\n" +
        "BQAwdTELMAkGA1UEBhMCVUsxEjAQBgNVBAgMCUJlcmtzaGlyZTEQMA4GA1UEBwwH\n" +
        "UmVhZGluZzEWMBQGA1UECgwNRGlmZnVzaW9uRGF0YTEUMBIGA1UECwwLRW5naW5l\n" +
        "ZXJpbmcxEjAQBgNVBAMMCURpZmZ1c2lvbjAeFw0yNTAxMjAxMjIxNTNaFw0zNTAx\n" +
        "MTgxMjIxNTNaMHUxCzAJBgNVBAYTAlVLMRIwEAYDVQQIDAlCZXJrc2hpcmUxEDAO\n" +
        "BgNVBAcMB1JlYWRpbmcxFjAUBgNVBAoMDURpZmZ1c2lvbkRhdGExFDASBgNVBAsM\n" +
        "C0VuZ2luZWVyaW5nMRIwEAYDVQQDDAlEaWZmdXNpb24wggEiMA0GCSqGSIb3DQEB\n" +
        "AQUAA4IBDwAwggEKAoIBAQCOwcLwiAZp5H6c1JYkLdy8E3XRsJ4UAVTolfcgfMH6\n" +
        "GQzH+feSmyUPs8zHGlERGL6/VYB/jWWfHT/T3Yui6E3ZCT5dvIp+NLunj0Ipsudd\n" +
        "5erXg7qd6Db47WL2MUBPwNVllPg1EkjXH7fjsINSI5SFTL3XBXa4CwC702jq3PoO\n" +
        "gg0cgGfyhgm+Y8tir1gE3pgZx87d6Y28qupXMgv+VCNlRWnvAbLjMsae5yZJMlRM\n" +
        "gIpsi13JVZkcegv+U/0vlDjFSBE/7p9NfDlBH+vu8yEaJjwV70ubEMjTHGQH7HFg\n" +
        "CbRem08XSeIsR1cI+7OxWxk8lh2wMdV6Y+WIygWy7ppTAgMBAAGjUzBRMB0GA1Ud\n" +
        "DgQWBBQWQ6tsUd/TU9cHEm8ZZPd6BbKTKjAfBgNVHSMEGDAWgBQWQ6tsUd/TU9cH\n" +
        "Em8ZZPd6BbKTKjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQB7\n" +
        "pYZ+JCDnOo5ZDp8tckwNuTTpo+B1yezJN3t1bOjCZbMdTah5b0VSzq8xnASTHNTK\n" +
        "VGgOso5sZ8M6nYECs1ZSxv5Czp9nzX8yoFs5Vpcrrc7bcsUDvl7juVvKahBRwu/+\n" +
        "O2tLct9KZmVYUB9VaNgisZYDts7o6tTslnmDa1kdV+/kKSgrR/6D/UeXT2P8NDhE\n" +
        "ZRlnVJRmwnCew7PTpvFJLSoOteFVYr9Xsq1QLWx0av7FgM3gLQlMdtAZHup+Rw52\n" +
        "8icwMrteLIMpM/hXC8Rs7x+gSQV4R6tre5Z4vrWUuV/Yg/AicyPu3gbu6qvKaHSS\n" +
        "BMVMOe0KDoxPOteoXiRm\n" +
        "-----END CERTIFICATE-----\n";

    private static final byte[] EXPECTED_BYTES;

    static {
        try {
            EXPECTED_BYTES = CertificateFactory.getInstance("X.509")
                .generateCertificate(new ByteArrayInputStream(SAMPLE_CRT.getBytes())).getEncoded();
        }
        catch (CertificateException e) {
            throw new RuntimeException(e);
        }
    }
}