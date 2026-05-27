# AWS S3 + CloudFront Image Hosting Setup

This guide walks you through setting up S3 and CloudFront to serve images for your portfolio with optimal security and caching.

## Architecture Overview

```
Your Local Machine
        ↓
   (AWS CLI)
        ↓
    S3 Bucket (Private)
        ↓
CloudFront Distribution (Public CDN)
        ↓
    Browser Client
```

---

## Part 1: Create S3 Bucket

### Step 1: Navigate to S3 Console
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/s3/)
2. Click **Create Bucket**

### Step 2: Configure Bucket Settings
| Setting | Value |
|---------|-------|
| Bucket Name | `portfolio-media-ariel` |
| Region | `us-east-1` (or your preferred region) |
| Block Public Access | ✅ Keep **Block all public access** checked (CloudFront will access via OAC) |
| Versioning | Optional: Enable for image rollback |

### Step 3: Create Bucket
Click **Create Bucket** at the bottom.

### Step 4: Disable "Block All Public Access" (for CloudFront OAC to work)
1. Go to **Permissions** tab in your bucket
2. Scroll to **Block public access (bucket settings)**
3. Click **Edit**
4. **Uncheck** "Block all public access"
5. Check the confirmation box: "I acknowledge that..."
6. Click **Save changes**

---

## Part 2: Create CloudFront Distribution

### Step 1: Navigate to CloudFront Console
1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**

### Step 2: Configure Origin

| Setting | Value |
|---------|-------|
| **Origin Domain** | Select your S3 bucket from dropdown (`portfolio-media-ariel.s3.amazonaws.com`) |
| **Origin Access** | Select **Origin access control settings (recommended)** |
| **Origin Access Control** | Click "Create control setting" → Name: `PortfolioOAC` → Create |
| **Enable Origin Shield** | No (optional optimization) |

### Step 3: Configure Default Cache Behavior

| Setting | Value |
|---------|-------|
| **Viewer Protocol Policy** | `Redirect HTTP to HTTPS` |
| **Allowed HTTP Methods** | `GET, HEAD` (read-only) |
| **Cache Policy** | `Managed-CachingOptimized` or create custom: TTL: 86400 (1 day) |
| **Compress Objects Automatically** | ✅ **Yes** |
| **Query Strings** | `No` |

### Step 4: Configure Distribution Settings

| Setting | Value |
|---------|-------|
| **Price Class** | `Price Class 100` (North America, Europe, Asia) |
| **Alternate Domain Names (CNAME)** | Leave empty (or add your custom domain later) |
| **Default Root Object** | Leave empty |
| **Enable IPv6** | ✅ Yes |

### Step 5: Create Distribution
Click **Create distribution** at the bottom.

**⏳ Wait 10-15 minutes** for CloudFront to deploy.

### Step 6: Update S3 Bucket Policy for OAC

1. Go back to your **S3 bucket**
2. Click **Permissions** tab
3. Scroll to **Bucket Policy**
4. AWS will show a notification: "Your CloudFront distribution is not authorized to access the S3 bucket."
5. Click the button to **Copy policy** from the CloudFront distribution notification
6. Or manually add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::portfolio-media-ariel/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

Replace `YOUR_ACCOUNT_ID` and `YOUR_DISTRIBUTION_ID` with your actual values from the CloudFront distribution details.

---

## Part 3: Create Folder Structure in S3

### Option A: Using AWS Console
1. Go to your S3 bucket
2. Click **Create folder**
3. Create these folders:
   - `profile/`
   - `projects/`
   - `tech-icons/`

### Option B: Using AWS CLI
```bash
aws s3api put-object --bucket portfolio-media-ariel --key profile/
aws s3api put-object --bucket portfolio-media-ariel --key projects/
aws s3api put-object --bucket portfolio-media-ariel --key tech-icons/
```

---

## Part 4: IAM Policy for Uploading Images

### Create IAM User (Optional but Recommended)

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Name: `portfolio-image-uploader`
4. Click **Create user**

### Add Inline Policy

1. Go to your user details
2. Click **Add inline policy** (or **Create inline policy**)
3. Choose **JSON** tab
4. Paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::portfolio-media-ariel",
        "arn:aws:s3:::portfolio-media-ariel/*"
      ]
    }
  ]
}
```

### (Optional) Restrict by IP Address

Add this condition to restrict uploads to your home IP:

```json
"Condition": {
  "IpAddress": {
    "aws:SourceIp": "YOUR_HOME_IP/32"
  }
}
```

Get your IP: Run `curl https://checkip.amazonaws.com` in terminal.

### Create Access Keys

1. Go to **Security credentials** tab
2. Click **Create access key**
3. Select **Command Line Interface (CLI)**
4. Accept the warning
5. Click **Create access key**
6. **Save the Access Key ID and Secret Access Key** (you won't see them again)

---

## Part 5: Configure AWS CLI and Upload Images

### Step 1: Install AWS CLI

```bash
# macOS
brew install awscli

# Windows (via chocolatey)
choco install awscliv2

# Or download from: https://aws.amazon.com/cli/
```

### Step 2: Configure AWS Credentials

```bash
aws configure
```

When prompted, enter:
```
AWS Access Key ID: [Your IAM user access key]
AWS Secret Access Key: [Your IAM user secret key]
Default region name: us-east-1
Default output format: json
```

### Step 3: Create Local Images Directory

```bash
# From your portfolio project root
mkdir -p images/profile
mkdir -p images/projects
mkdir -p images/tech-icons
```

### Step 4: Upload Images to S3

```bash
# Upload all images with private ACL (recommended)
aws s3 sync ./images s3://portfolio-media-ariel --acl private

# Upload specific folder
aws s3 sync ./images/profile s3://portfolio-media-ariel/profile --acl private

# Upload single file
aws s3 cp ./images/profile/avatar.jpg s3://portfolio-media-ariel/profile/ --acl private
```

### Step 5: Access Images via CloudFront

Once your CloudFront distribution is deployed, use URLs like:

```
https://d1234567890.cloudfront.net/profile/avatar.jpg
https://d1234567890.cloudfront.net/projects/project1.png
https://d1234567890.cloudfront.net/tech-icons/react.svg
```

Replace `d1234567890.cloudfront.net` with your **CloudFront Domain Name** (visible in CloudFront console).

---

## Part 6: Use CloudFront URLs in Your React App

### Create Image Service Hook

```javascript
// src/hooks/useImageUrl.js
export const useImageUrl = (path) => {
  const cloudFrontDomain = import.meta.env.VITE_CLOUDFRONT_DOMAIN || 'https://d1234567890.cloudfront.net'
  return `${cloudFrontDomain}/${path}`
}
```

### Update .env

```env
VITE_CLOUDFRONT_DOMAIN=https://d1234567890.cloudfront.net
```

### Use in Components

```jsx
import { useImageUrl } from '../hooks/useImageUrl'

export default function ProfileCard() {
  const imageUrl = useImageUrl('profile/avatar.jpg')
  return <img src={imageUrl} alt="Profile" />
}
```

---

## Part 7: Verify Setup

### Test CloudFront Access

```bash
# Check if CloudFront can serve your image
curl -I https://d1234567890.cloudfront.net/profile/avatar.jpg

# Should return: 200 OK
```

### Monitor CloudFront Performance

1. Go to CloudFront **Monitoring**
2. Check metrics:
   - **Requests** (should increase as images load)
   - **Cache Hit Rate** (should be >95% after initial load)
   - **Bytes Downloaded**

---

## Part 8: Caching & Invalidation

### Manual Invalidation (if you update an image)

```bash
# Invalidate specific file
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/profile/avatar.jpg"

# Invalidate all files
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Auto-Invalidation (Optional)

You can add this to your CI/CD pipeline (GitHub Actions) to automatically invalidate CloudFront when images change.

---

## Part 9: Security Checklist

✅ **S3 Bucket:**
- [ ] Block public access enabled
- [ ] Bucket policy restricts to CloudFront OAC only
- [ ] Versioning enabled (optional)
- [ ] Server-side encryption enabled (S3-managed or KMS)

✅ **CloudFront:**
- [ ] Origin Access Control (OAC) configured
- [ ] HTTPS enforced
- [ ] Compression enabled
- [ ] Appropriate cache TTL set

✅ **IAM:**
- [ ] Dedicated user for uploads with minimal permissions
- [ ] Access keys rotated regularly
- [ ] IP restriction enabled (optional)

---

## Troubleshooting

### "Access Denied" when uploading to S3
- Verify IAM policy includes `s3:PutObject` action
- Check bucket policy allows your IAM user

### CloudFront returns 403 Forbidden
- Verify S3 bucket policy has OAC condition
- Check CloudFront Origin Access Control is created

### Images not caching
- Go to CloudFront **Invalidations** and check if any are pending
- Verify cache policy TTL is set correctly
- Check CloudFront logs for cache hit ratio

---

## Cost Estimation

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| S3 Storage | 1 GB images | ~$0.02 |
| CloudFront | 100 GB transfer | ~$8.50 |
| Data Transfer | S3 → CloudFront | Free (same region) |
| **Total** | **Typical portfolio** | **~$8.50** |

---

## Next Steps

1. ✅ Create S3 bucket and CloudFront distribution
2. ✅ Configure folder structure
3. ✅ Set up IAM user and credentials
4. ✅ Upload images using AWS CLI
5. ✅ Update your React components to use CloudFront URLs
6. ✅ Test caching and performance
