#!/usr/bin/env python3
"""
Test script for user anonymization endpoints

Tests:
1. Create user profile
2. Retrieve profile
3. Start session
4. End session
5. Export user data
6. Delete user account
"""

import requests
import json
from datetime import datetime
import sys

BASE_URL = "http://localhost:8000"


def test_create_profile():
    """Test creating a new user profile"""
    print("\n🧪 Test 1: Create user profile")

    response = requests.post(
        f"{BASE_URL}/api/user/profile",
        params={
            "moniker": "TestStarGazer42",
            "data_retention": "minimal",
            "consent_analytics": False,
        },
        json={
            "age_band": "18-42",
            "region_band": "Eastern US",
        },
    )

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return None

    profile = response.json()
    print(f"✅ Created profile: {profile['moniker']} ({profile['user_id']})")
    print(f"   Age: {profile.get('age_band')}, Region: {profile.get('region_band')}")
    print(f"   Retention: {profile['data_retention']}")

    return profile["user_id"]


def test_get_profile(user_id):
    """Test retrieving user profile"""
    print(f"\n🧪 Test 2: Get user profile")

    response = requests.get(f"{BASE_URL}/api/user/profile/{user_id}")

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False

    profile = response.json()
    print(f"✅ Retrieved profile: {profile['moniker']}")
    print(f"   Created: {profile['created_at']}")
    print(f"   Last active: {profile['last_active']}")

    return True


def test_start_session(user_id):
    """Test starting a new session"""
    print(f"\n🧪 Test 3: Start session")

    response = requests.post(
        f"{BASE_URL}/api/user/session/start", params={"user_id": user_id}
    )

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return None

    session = response.json()
    print(f"✅ Started session: {session['session_id']}")
    print(f"   Retention: {session['retention_days']} days")

    return session["session_id"]


def test_end_session(session_id):
    """Test ending a session"""
    print(f"\n🧪 Test 4: End session")

    response = requests.post(
        f"{BASE_URL}/api/user/session/end",
        params={
            "session_id": session_id,
            "summary": "Test session completed successfully",
        },
    )

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False

    result = response.json()
    print(f"✅ Ended session: {session_id}")
    print(f"   Duration: {result['duration_minutes']:.2f} minutes")
    print(f"   Delete after: {result['delete_after']}")

    return True


def test_export_data(user_id):
    """Test exporting user data (GDPR)"""
    print(f"\n🧪 Test 5: Export user data (GDPR/CCPA)")

    response = requests.post(f"{BASE_URL}/api/user/export", params={"user_id": user_id})

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False

    export = response.json()
    print(f"✅ Exported data for: {export['user_profile']['moniker']}")
    print(f"   Active sessions: {len(export['active_sessions'])}")
    print(f"   Archived sessions: {len(export['archived_sessions'])}")
    print(f"   Total messages: {export['total_message_count']}")
    print(f"   Export ID: {export['export_id']}")

    return True


def test_delete_account(user_id, moniker):
    """Test deleting user account (right to be forgotten)"""
    print(f"\n🧪 Test 6: Delete user account (Right to be Forgotten)")

    response = requests.delete(
        f"{BASE_URL}/api/user/delete",
        json={
            "user_id": user_id,
            "confirmation_token": "I_CONFIRM_DELETE",
            "delete_all": True,
        },
    )

    if response.status_code != 200:
        print(f"❌ Failed: {response.status_code} - {response.text}")
        return False

    result = response.json()
    print(f"✅ Deleted account: {result['moniker']}")
    print(f"   Sessions deleted: {result['sessions_deleted']}")
    print(f"   Deleted at: {result['deleted_at']}")

    # Verify deletion
    verify = requests.get(f"{BASE_URL}/api/user/profile/{user_id}")
    if verify.status_code == 404:
        print(f"✅ Verified: User no longer exists")
        return True
    else:
        print(f"❌ Failed: User still exists after deletion")
        return False


def main():
    print("=" * 60)
    print("User Data Anonymization Framework — Backend Test Suite")
    print("=" * 60)

    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Backend is running at {BASE_URL}")
    except requests.exceptions.ConnectionError:
        print(f"❌ Backend is not running at {BASE_URL}")
        print(f"   Start with: cd backend && uvicorn main:app --reload")
        sys.exit(1)

    # Run tests
    user_id = test_create_profile()
    if not user_id:
        sys.exit(1)

    if not test_get_profile(user_id):
        sys.exit(1)

    session_id = test_start_session(user_id)
    if not session_id:
        sys.exit(1)

    if not test_end_session(session_id):
        sys.exit(1)

    if not test_export_data(user_id):
        sys.exit(1)

    # Get profile one more time to capture moniker before deletion
    profile_response = requests.get(f"{BASE_URL}/api/user/profile/{user_id}")
    moniker = profile_response.json()["moniker"]

    if not test_delete_account(user_id, moniker):
        sys.exit(1)

    print("\n" + "=" * 60)
    print("✅ All tests passed!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Wire onboarding flow to backend API")
    print("2. Add PostgreSQL persistence (replace in-memory storage)")
    print("3. Schedule cleanup jobs (cron/celery)")
    print("4. Add crisis resources to all user-facing pages")
    print("5. Run full end-to-end test with real user flow")


if __name__ == "__main__":
    main()
