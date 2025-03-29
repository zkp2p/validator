# 🚀 ZKP2P Validator

This service runs on Phala Cloud and is responsible for encrypting credentials and verifying payments in a trust-minimized environment. It leverages the dStack SDK and Phala’s decentralized root of trust (dRoT) to generate Remote Attestation (RA) reports and manage keys securely inside a TEE. The service can be hosted by us on Phala Cloud or self-hosted by liquidity providers. To keep the code minimal, it does not interact directly with the blockchain.

---

## 🌟 Key Design Decisions

- **RA‑TLS & TEE-Only Operations:**  
  All communication with the TEE is secured using RA‑TLS, ensuring that sensitive data (e.g., Wise API keys) is transmitted only to a verified, attested TEE instance.

- **Encryption with Phala’s AppKey:**  
  The service leverages Phala Cloud’s built-in AppKey (provided via dRoT) to encrypt credentials. This key is automatically provisioned and bound to the TEE, so plaintext credentials never leave the enclave.

- **Remote Attestation (RA) Reports:**  
  The service provides a public endpoint to generate RA reports using the dStack SDK. These reports can include custom user-data and ensure that clients can verify the integrity and authenticity of the TEE instance.

- **Separation from Blockchain:**  
  To keep the service minimal and secure, it does not interact with the blockchain. Instead, it focuses solely on off-chain credential encryption and payment verification logic.

**References:**
- [Phala Cloud Documentation](https://docs.phala.network/phala-cloud)
- [dStack Repository](https://github.com/Dstack-TEE/dstack)

---

## 🌟 Local Development Guide

### Installation

- Run `yarn install` to install dependencies.
- Create a `.env` file by copying `.env.template`:
  ```bash
  cp .env.template .env
  ```
- Update the `.env` file with the necessary environment variables.
  - Use `.env.test` for testing.
  - Use `.env.development` for local development.
  - `.env` is used for production.

### Testing

- Run tests with:
  ```bash
  yarn test
  ```

### Environment Configuration

- Ensure that all required environment variables are set in your `.env` file.
- Variables include API keys, database configurations, and Phala/dStack settings.

---

## 🌟 Deployment Guide

### Phala Cloud Deployment

- The service can be deployed on Phala Cloud using Docker.
- Configure Docker volumes to persist data as described in the [Phala Cloud Migration Docs](https://docs.phala.network/phala-cloud/migration).
- Follow internal deployment checklists and CI/CD pipelines to ensure the service is securely deployed.
- [x] (Deployment steps to be confirmed by the infrastructure team)
