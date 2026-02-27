#!/usr/bin/env python3
"""
Send test transactions on all funded Lux chains across mainnet, testnet, and devnet.

Usage:
    python3 tools/send_test_txs.py [--network mainnet|testnet|devnet|all] [--count 10]

Requires: web3, eth_account (pip install web3)
Requires: kubectl port-forward running or will start them automatically.
"""

import argparse
import json
import os
import signal
import subprocess
import sys
import time

from eth_account import Account
from web3 import Web3

# Key file path
KEY_FILE = os.path.expanduser("~/.lux/keys/testnet-idx1/ec/private.key")

# Chain definitions per network
# Format: (name, blockchain_id_or_alias, evm_chain_id)
CHAINS = {
    "mainnet": {
        "port": 9630,
        "local_port": 19630,
        "namespace": "lux-mainnet",
        "chains": [
            ("C-chain", "C", 96369),
            ("Zoo", "FGanBWHZEetE7yXqGxKeUWHjDxmuKYpQ6sGdHJnrDNqQ8AoP7", 200200),
            # Hanzo, SPC, Pars: our key has 0 balance on mainnet (treasury key needed)
        ],
    },
    "testnet": {
        "port": 9640,
        "local_port": 19640,
        "namespace": "lux-testnet",
        "chains": [
            ("C-chain", "C", 96368),
            ("Zoo", "vEw2TquNRZm5ckng8fJi9JGuKiuTdQA81YNZC3A1jeYhDRH5V", 200201),
            # Hanzo, SPC, Pars: 0 balance on testnet for our key
        ],
    },
    "devnet": {
        "port": 9650,
        "local_port": 19650,
        "namespace": "lux-devnet",
        "chains": [
            ("C-chain", "C", 96370),
            ("Zoo", "2dNppzzx7WC1cagAzVRjVP4Qf5n9BRLgVsd2L6BwDbocAVVqBz", 200202),
            ("Hanzo", "8saqkhsUrijPci3RXQnNaaLLkYXBErauhwUsZZwdj8erxeaZv", 36964),
            ("SPC", "AbticcB4ymCPL914ZBMozSSjFwVGw8xFKM35aiJDTAs6aed4M", 36912),
            ("Pars", "2LnHt7NQTpLHCpAxbfHkRNse7bpkRGXwrLQvGzE7tapSq9qsyh", 494951),
        ],
    },
}

# Transaction amount: 0.001 native token
TX_VALUE = Web3.to_wei(0.001, "ether")

# Port forward processes to clean up
pf_procs = []


def cleanup():
    """Kill all port-forward processes."""
    for proc in pf_procs:
        try:
            proc.terminate()
            proc.wait(timeout=5)
        except Exception:
            try:
                proc.kill()
            except Exception:
                pass


def signal_handler(sig, frame):
    cleanup()
    sys.exit(1)


signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)


def start_port_forward(namespace, local_port, remote_port):
    """Start kubectl port-forward in background."""
    cmd = [
        "kubectl", "port-forward",
        "-n", namespace,
        "svc/luxd-headless",
        f"{local_port}:{remote_port}",
    ]
    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    pf_procs.append(proc)
    time.sleep(2)  # Wait for port forward to establish
    return proc


def check_port_in_use(port):
    """Check if a port is already in use."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("127.0.0.1", port)) == 0


def get_rpc_url(local_port, blockchain_id):
    """Build the RPC URL for a chain."""
    return f"http://localhost:{local_port}/ext/bc/{blockchain_id}/rpc"


def send_transactions(network_name, net_config, account, tx_count):
    """Send transactions on all chains for a network."""
    local_port = net_config["local_port"]
    namespace = net_config["namespace"]
    remote_port = net_config["port"]

    # Start port forward if not already running
    if not check_port_in_use(local_port):
        print(f"\n  Starting port-forward {namespace} {local_port}:{remote_port}...")
        start_port_forward(namespace, local_port, remote_port)
        if not check_port_in_use(local_port):
            print(f"  ERROR: Failed to establish port-forward for {namespace}")
            return
    else:
        print(f"\n  Port {local_port} already forwarded")

    for chain_name, blockchain_id, expected_chain_id in net_config["chains"]:
        rpc_url = get_rpc_url(local_port, blockchain_id)
        print(f"\n  --- {network_name} / {chain_name} (chain ID {expected_chain_id}) ---")
        print(f"  RPC: {rpc_url}")

        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url, request_kwargs={"timeout": 10}))

            # Verify chain ID
            chain_id = w3.eth.chain_id
            if chain_id != expected_chain_id:
                print(f"  WARNING: Expected chain ID {expected_chain_id}, got {chain_id}")

            # Check balance
            balance = w3.eth.get_balance(account.address)
            balance_eth = Web3.from_wei(balance, "ether")
            print(f"  Balance: {balance_eth:.6f}")

            if balance < TX_VALUE * 2:  # Need at least 2x value for gas
                print(f"  SKIP: Insufficient balance ({balance_eth} < {Web3.from_wei(TX_VALUE * 2, 'ether')})")
                continue

            # Get starting nonce
            nonce = w3.eth.get_transaction_count(account.address)
            print(f"  Starting nonce: {nonce}")

            # Get gas price
            gas_price = w3.eth.gas_price
            print(f"  Gas price: {Web3.from_wei(gas_price, 'gwei'):.2f} gwei")

            # Send transactions
            tx_hashes = []
            for i in range(tx_count):
                tx = {
                    "to": account.address,  # Self-transfer
                    "value": TX_VALUE,
                    "gas": 21000,
                    "gasPrice": gas_price,
                    "nonce": nonce + i,
                    "chainId": chain_id,
                }

                signed = account.sign_transaction(tx)
                try:
                    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
                    tx_hashes.append(tx_hash.hex())
                    print(f"  TX {i+1}/{tx_count}: {tx_hash.hex()}")
                except Exception as e:
                    print(f"  TX {i+1}/{tx_count} FAILED: {e}")
                    break

            # Wait for last tx to be mined (up to 30s)
            if tx_hashes:
                print(f"\n  Waiting for confirmations...")
                last_hash = tx_hashes[-1]
                for attempt in range(30):
                    try:
                        receipt = w3.eth.get_transaction_receipt(last_hash)
                        if receipt:
                            print(f"  Last TX confirmed in block {receipt['blockNumber']}, status={receipt['status']}")
                            break
                    except Exception:
                        pass
                    time.sleep(1)
                else:
                    print(f"  WARNING: Last TX not confirmed after 30s")

                # Print final balance
                new_balance = w3.eth.get_balance(account.address)
                spent = balance - new_balance
                print(f"  New balance: {Web3.from_wei(new_balance, 'ether'):.6f} (spent {Web3.from_wei(spent, 'ether'):.6f} in gas)")
                print(f"  Total TXs sent: {len(tx_hashes)}")

        except Exception as e:
            print(f"  ERROR: {e}")


def main():
    parser = argparse.ArgumentParser(description="Send test transactions on Lux chains")
    parser.add_argument(
        "--network",
        choices=["mainnet", "testnet", "devnet", "all"],
        default="all",
        help="Network to send on (default: all)",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=10,
        help="Number of transactions per chain (default: 10)",
    )
    args = parser.parse_args()

    # Load private key
    print("Loading private key...")
    with open(KEY_FILE) as f:
        key_hex = f.read().strip()
    account = Account.from_key("0x" + key_hex)
    print(f"Address: {account.address}")

    # Determine networks to process
    if args.network == "all":
        networks = ["mainnet", "testnet", "devnet"]
    else:
        networks = [args.network]

    try:
        for net in networks:
            print(f"\n{'='*60}")
            print(f"  NETWORK: {net.upper()}")
            print(f"{'='*60}")
            send_transactions(net, CHAINS[net], account, args.count)
    finally:
        cleanup()

    print(f"\n{'='*60}")
    print("  DONE")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
