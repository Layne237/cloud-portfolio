# CloudFront Image Hosting Guide

## Quick Start: React Image References

### Basic HTML `<img>` Tag
```jsx
<img 
  src="https://d1234567890.cloudfront.net/images/profile/ariel.jpg" 
  alt="Ariel's profile photo"
  className="w-32 h-32 rounded-full"
/>
```

### Using Environment Variables (Recommended)
```jsx
// .env
VITE_CLOUDFRONT_DOMAIN=https://d1234567890.cloudfront.net

// MyComponent.jsx
const avatarUrl = `${import.meta.env.VITE_CLOUDFRONT_DOMAIN}/images/profile/ariel.jpg`;

<img src={avatarUrl} alt="Profile" />
```

### Custom Hook for Image URLs
```javascript
// src/hooks/useImageUrl.js
export const useImageUrl = (imagePath) => {
  const domain = import.meta.env.VITE_CLOUDFRONT_DOMAIN;
  return `${domain}/${imagePath}`;
};

// Usage in component
import { useImageUrl } from '../hooks/useImageUrl';

export default function Profile() {
  const avatarUrl = useImageUrl('images/profile/ariel.jpg');
  const projectThumbnail = useImageUrl('images/projects/project-1.jpg');
  
  return (
    <div>
      <img src={avatarUrl} alt="Avatar" />
      <img src={projectThumbnail} alt="Project" />
    </div>
  );
}
```

### Dynamic Image Handling
```jsx
// For multiple images from a project
const projectImages = [
  'images/projects/dashboard-preview.png',
  'images/projects/dashboard-stats.png',
  'images/projects/dashboard-mobile.png'
];

<div className="grid grid-cols-3 gap-4">
  {projectImages.map(imagePath => (
    <img 
      key={imagePath}
      src={useImageUrl(imagePath)} 
      alt="Project screenshot"
      className="w-full rounded"
    />
  ))}
</div>
```

---

## Why S3 + CloudFront is Better Than Git

### ❌ Storing Images in Git (Problematic)
- **Repository Bloat**: Each image increases repo size permanently in history
- **Clone Slow**: `git clone` becomes slower for every developer
- **CI/CD Delays**: Pipeline takes longer to download, build, deploy
- **Version Control Overhead**: Git tracks every image change in commit history
- **Bandwidth**: CDN downloads entire repo history on every clone
- **Merge Conflicts**: Binary files cause merge issues
- **Not Designed for This**: Git is for code, not binary assets

**Example Problem**: A 100KB profile photo in Git = every clone includes that 100KB forever, multiplied by every developer × every pipeline run.

### ✅ S3 + CloudFront (Optimal)
- **Separation of Concerns**: Code in Git, assets in S3
- **Fast Clones**: Repo stays lightweight (<10MB)
- **CDN Distribution**: Images served from edge locations near users
- **Easy Updates**: Replace images without new deployments
- **Immutable**: S3 objects don't change (no merge conflicts)
- **Built for Media**: S3 handles binary, large files efficiently
- **Global Reach**: CloudFront has 600+ edge locations worldwide

---

## How CloudFront Caches Images at Edge Locations

### 📍 The Problem Without CloudFront
```
User in Tokyo
        ↓
    Internet
        ↓
   AWS S3 (Oregon)
        ↓
   ~150ms latency
   High bandwidth cost
```

### ⚡ With CloudFront
```
User in Tokyo
        ↓
CloudFront Edge (Tokyo) ← CACHED ✓
    First request: Download from S3 (slow, but cached)
    Subsequent requests: Served from edge (fast!)
    
    Latency: 5-20ms
    Bandwidth: Cheap (inter-AWS, not internet)
```

### Cache Flow Details

**First Request (Cache Miss)**:
```
Client → CloudFront Edge (Tokyo)
              ↓
         Not cached? → S3 (Oregon)
              ↓
         Cache for 1 day (or your TTL)
              ↓
         Return to client (150ms)
```

**Subsequent Requests (Cache Hit)**:
```
Client → CloudFront Edge (Tokyo)
              ↓
         Cached? ✓ → Return immediately (10ms)
              ↓
         Cost: Virtually free
```

### Why This Matters
- **Speed**: Visitors from everywhere get ~50ms or less latency
- **Cost**: CloudFront is cheaper than S3 for repeated downloads
- **Reliability**: If S3 has issues, CloudFront keeps serving cached content
- **Scale**: Automatic—no code changes needed as traffic grows

### Example: Your Portfolio
```
Profile photos (high repeat): 1000 views/day → 1 S3 download, 999 from edge
Project screenshots: 500 views/day → 1 S3 download, 499 from edge
Tech stack icons: 10,000 views/day → 1 S3 download, 9,999 from edge
```

---

## Cost Analysis

### Pricing (US Rates, May 2026)

| Component | Cost | Portfolio Volume |
|-----------|------|------------------|
| **S3 Storage** | $0.023/GB/month | 1GB portfolio = **$0.023/month** |
| **S3 Requests** | $0.0004 per 10K | 100K monthly = **$0.004/month** |
| **CloudFront** | $0.085/GB | 100GB/month = **$8.50/month** |
| **Total** | — | **~$8.58/month** |

### Real Portfolio Example
- S3 storage: 500MB images = **$0.01/month**
- S3 requests: 500K/month = **$0.02/month**
- CloudFront data: 50GB/month (lots of traffic) = **$4.25/month**
- **Total: ~$4.28/month** ✓ That's **pennies per day**

### Comparison to Alternatives
| Solution | Monthly Cost | Speed |
|----------|-------------|-------|
| Git (extra developers) | $0 | Slow (150ms) |
| Static hosting (Netlify) | $20-100 | Medium (good) |
| **S3 + CloudFront** | **$5-10** | **Fast (10ms)** |
| Dedicated CDN (AWS Shield+) | $3000+ | Fastest |

**Winner**: S3 + CloudFront is the sweet spot of cost, speed, and simplicity.

---

## AWS Free Tier (12 Months)

### What You Get Free
- **5 GB** S3 storage
- **1 TB** (1,000 GB) CloudFront data transfer
- **20,000** S3 PUT/COPY/POST/LIST requests
- **100,000** S3 GET requests

### How This Covers Your Portfolio
```
Scenario: 1000 daily visitors, 5 images per visit

Daily:
  - Visitors: 1000 × 5 images = 5000 requests
  - Unique images: 50 (cached, so mostly free CF transfer)
  - Monthly: 150,000 requests = Still within free tier ✓

Yearly Usage:
  - Storage: 500MB (well under 5GB) ✓
  - CloudFront: 50GB/month × 12 = 600GB (under 1TB) ✓
  - Cost: $0/year ✓✓✓
```

### When You Exceed Free Tier
- Portfolio grows to 2000/day visits?
- CloudFront: ~100GB/month = **$8.50/month**
- Still cheaper than Netlify!

---

## Implementation Checklist

- [ ] Create S3 bucket (follow AWS_S3_CLOUDFRONT_SETUP.md Part 1)
- [ ] Create CloudFront distribution (Part 2)
- [ ] Update `.env` with `VITE_CLOUDFRONT_DOMAIN`
- [ ] Create `src/hooks/useImageUrl.js`
- [ ] Update components to use CloudFront URLs
- [ ] Upload images: `aws s3 sync ./images s3://portfolio-media-ariel --acl private`
- [ ] Test image delivery: `curl -I https://your-domain.cloudfront.net/images/profile/ariel.jpg`
- [ ] Monitor CloudFront cache hit ratio (target: >95%)

### AWS CLI Installation (Windows)

Method A: Using winget (Windows Package Manager - easiest)
```powershell
winget install --id Amazon.AWSCLI
```

Method B: Using Chocolatey (if installed)
```powershell
choco install awscli
```

Method C: Manual MSI installer
1. Open your browser and go to https://awscli.amazonaws.com/AWSCLIV2.msi
2. Download and run the MSI installer
3. After installation, verify with:
```powershell
aws --version
```

Note: After installing, run `aws configure` to set your Access Key ID, Secret Access Key, default region, and output format before using S3 commands.

---

## Common Questions

**Q: How do I invalidate/update a cached image?**
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234ABCD \
  --paths "/images/profile/ariel.jpg"
```

**Q: What if CloudFront is down?**
CloudFront always has failover to S3, plus multiple edge locations. Virtually impossible to have full outage.

**Q: Can I use CloudFront for dynamic content?**
Yes! Great for API responses, HTML with TTL=0 for real-time updates.

**Q: Is this secure?**
Yes! Origin Access Control (OAC) prevents direct S3 access. Users can only download via CloudFront.

**Q: Mobile optimization?**
CloudFront automatically serves gzip/brotli compression. Responsive images work normally.

---

## Edge Cases & Troubleshooting

| Issue | Solution |
|-------|----------|
| Image not loading | Check CloudFront URL is correct; CORS enabled? (usually not needed) |
| Stale content showing | Invalidate cache or wait for TTL |
| High data transfer costs | Reduce TTL, use image optimization (next step) |
| HTTPS certificate warning | CloudFront provides free ACM certificate |

---

## Next Steps: Image Optimization

Once hosting is working, consider:
1. **WebP Format**: Convert images to WebP (smaller files)
2. **Responsive Images**: Use `srcset` for different screen sizes
3. **Lazy Loading**: Add `loading="lazy"` for below-fold images
4. **Image Optimization Lambda@Edge**: Automatic resizing on demand

These are advanced but CloudFront makes them easy—no build step needed!

---

## Summary

| Aspect | Benefit |
|--------|---------|
| **Reference** | `src={useImageUrl('path/to/image.jpg')}` |
| **Why Better Than Git** | Code + assets separation, fast clones |
| **CloudFront Magic** | Caches at 600+ edge locations, <20ms latency |
| **Cost** | $5-10/month for typical portfolio (free tier covers it!) |
| **Setup Time** | 30 minutes (Part 1-5 of AWS_S3_CLOUDFRONT_SETUP.md) |

**Status**: Ready to deploy! 🚀
