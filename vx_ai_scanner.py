#!/usr/bin/env python3
"""
VX AI - Advanced Sovereign Intelligence & Security Suite
Module: Web Diagnostics & Vulnerability Assessment
Developer: Anas Dev
"""

import ssl
import socket
from datetime import datetime

# Universal HTTP Client: Uses 'requests' if installed, otherwise built-in 'urllib.request'
try:
    import requests

    def http_get(url, timeout=3, allow_redirects=True):
        try:
            r = requests.get(url, timeout=timeout, allow_redirects=allow_redirects, headers={'User-Agent': 'VX-AI-Scanner/1.0'})
            return r.status_code, {k.lower(): v for k, v in r.headers.items()}, r.text
        except requests.RequestException:
            return 0, {}, ''
except ImportError:
    import urllib.request as urllib_req
    import urllib.error as urllib_err

    class NoRedirectHandler(urllib_req.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None

    def http_get(url, timeout=3, allow_redirects=True):
        opener = urllib_req.build_opener() if allow_redirects else urllib_req.build_opener(NoRedirectHandler)
        req = urllib_req.Request(url, headers={'User-Agent': 'VX-AI-Scanner/1.0'})
        try:
            with opener.open(req, timeout=timeout) as resp:
                headers = {k.lower(): v for k, v in resp.headers.items()}
                body = resp.read().decode('utf-8', errors='ignore')
                return resp.status, headers, body
        except urllib_err.HTTPError as e:
            headers = {k.lower(): v for k, v in e.headers.items()}
            return e.code, headers, ''
        except Exception:
            return 0, {}, ''


class VXAIAdvancedScanner:
    def __init__(self, target_url):
        self.target_url = target_url.rstrip('/')
        if not self.target_url.startswith(('http://', 'https://')):
            self.target_url = 'https://' + self.target_url
        self.results = {
            "target": self.target_url,
            "scan_timestamp": datetime.now().isoformat(),
            "admin_routes": [],
            "rate_limiting": {},
            "sensitive_files": [],
            "ssl_status": {},
            "db_robustness": {}
        }

    def scan_admin_routes(self):
        """1. Admin Route & Endpoint Discovery"""
        common_paths = ["/admin", "/administrator", "/login", "/dashboard", "/api/v1/auth", "/panel"]
        print("[*] 1/5 Scanning for Admin Routes & Endpoints...")
        for path in common_paths:
            url = f"{self.target_url}{path}"
            status, _, _ = http_get(url, timeout=3, allow_redirects=False)
            if status in [200, 401, 403]:
                self.results["admin_routes"].append({"path": path, "status": status})

    def check_rate_limiting(self):
        """2. Rate Limiting Diagnostics"""
        print("[*] 2/5 Checking Rate Limiting & Security Headers...")
        headers_to_check = ["ratelimit", "retry-after", "x-rate-limit", "x-ratelimit-remaining", "cf-ray"]
        status, headers, _ = http_get(self.target_url, timeout=3)
        found_headers = {h: headers.get(h) for h in headers_to_check if h in headers}
        self.results["rate_limiting"] = {
            "protected": len(found_headers) > 0,
            "headers_found": found_headers,
            "status": "Shielded by WAF/RateLimiter" if found_headers else "No Explicit RateLimit Headers"
        }

    def scan_sensitive_files(self):
        """3. Sensitive Files & Documentation Discovery"""
        files = ["/.env", "/.git/config", "/backup.zip", "/config.json", "/robots.txt"]
        print("[*] 3/5 Auditing Sensitive Files (.env, backups, etc.)...")
        for f in files:
            url = f"{self.target_url}{f}"
            status, _, _ = http_get(url, timeout=3, allow_redirects=False)
            if status == 200:
                self.results["sensitive_files"].append({"file": f, "status": "EXPOSED (Critical)"})
            else:
                self.results["sensitive_files"].append({"file": f, "status": "Secured/Blocked"})

    def check_ssl_tls(self):
        """4. SSL/TLS Vulnerability Inspection"""
        print("[*] 4/5 Inspecting SSL/TLS Certificate...")
        if self.target_url.startswith("https://"):
            domain = self.target_url.replace("https://", "").split("/")[0].split(":")[0]
            ctx = ssl.create_default_context()
            try:
                with socket.create_connection((domain, 443), timeout=3) as sock:
                    with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                        cert = ssock.getpeercert()
                        self.results["ssl_status"] = {
                            "valid": True,
                            "cipher": ssock.cipher(),
                            "version": ssock.version(),
                            "issuer": dict(x[0] for x in cert.get('issuer', [])),
                            "expires": cert.get('notAfter')
                        }
            except Exception as e:
                self.results["ssl_status"] = {"valid": False, "error": str(e)}
        else:
            self.results["ssl_status"] = {"status": "HTTP used instead of HTTPS (Insecure)"}

    def check_db_robustness(self):
        """5. Database Parameter & SQL Injection Robustness Heuristics"""
        print("[*] 5/5 Checking Database Parameter Robustness...")
        test_url = f"{self.target_url}/?id=1'"
        _, _, body = http_get(test_url, timeout=3)
        error_signatures = ["sql syntax", "mysql_fetch", "ora-01756", "postgresql", "sqlite3"]
        has_error = any(sig in body.lower() for sig in error_signatures)
        self.results["db_robustness"] = {
            "safe": not has_error,
            "status": "Vulnerable to Error Leakage" if has_error else "Hardened / Sanitized"
        }

    def run_full_audit(self):
        print(f"\n================ VX AI AUDIT START: {self.target_url} ================")
        self.scan_admin_routes()
        self.check_rate_limiting()
        self.scan_sensitive_files()
        self.check_ssl_tls()
        self.check_db_robustness()
        print("================ VX AI AUDIT COMPLETED ================\n")
        return self.results


if __name__ == "__main__":
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else input("Enter target URL (e.g., https://example.com): ")
    scanner = VXAIAdvancedScanner(target)
    report = scanner.run_full_audit()
    print("[+] Audit Report Output:")
    print(report)
