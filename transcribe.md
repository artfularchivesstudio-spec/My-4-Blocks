Great to meet you! I’ll design the Sora 2 iOS client that submits prompts, tracks progress, and plays generated videos.


Confirming scope: focus on mobile only, backend is pre-built.


Success metrics: P95 first-frame under 1 s after playback start, smooth 60 fps, background compliance.


Functional reqs: prompt entry, progress bar, preview thumbnail stream, full HLS playback, offline viewing within 24 h.


NFRs: battery less than 3% per 5-min session, app size less than 200 MB, iOS 17 minimum.


Out of scope: in-app editing, social share v2.


Peak 100k MAU points to the right 500 concurrent sessions points to the right 50 RPS to status endpoint.


View (SwiftUI) points to the right ViewModel points to the right Repository points to the right API Service; side cache component; PlayerCoordinator downstream.


View uses NavigationStack; ViewModel publishes @Published JobState.


Repository abstracts network plus persistence; API Service wraps URLSession with Combine publishers.


Job submission: POST /generate, returns job_id, stored in Core Data with status queued.


Progress polling every 5 s via Timer.publish for free tier; paid tier upgrades to WebSocket push.


Battery trade-off: push saves ~0.7% per 10 min; justify as premium value.


When user backgrounds app, BGProcessingTask continues polling plus download; deadline 30 min, requires external-power override.


Fallback: schedule silent push at 75% progress to wake app if BG task expired.


Use URLSessionDownloadTask with supportsResume equals true; tracks resumeData in Core Data.


Disk space guard: if free storage is less than 1 GB, prompt user or delay download.


3-tier: RAM 20 MB, Disk LRU 2 GB, CDN. Cache key equals job_id plus rendition.


Eviction policy: age plus last-access score, MetricKit monitors cache hit % goal 85%.


PlayerCoordinator wraps AVQueuePlayer; pre-buffers first 3 HLS segments; uses preferredForwardBufferDuration equals 6.


On 120 Hz devices frame budget 8 ms — we off-thread decode via AVSampleBufferDisplayLayer for previews.


Core Data vs Realm: picked Core Data plus NSPersistentCloudKit for built-in sync; Realm would simplify API but adds binary ~5 MB and GPL concerns.


SSE vs WebSocket: SSE cheaper in CPU, but single-direction; we need bidirectional for cancellations, so we chose WebSocket for paid tier only.


Use XCTMetric for cold-start; target less than 400 ms on A15.


Scrolling performance: LazyVStack plus prefetch(range: 2), image placeholders use BlurHash.


Crashlytics plus MetricKit: track terminationReason equals .memory.


JWT stored in Keychain; ATS pinned; videos encrypted at rest in cache using AES-GCM.


Feature flag client_video_cache_v2; staged 10% points to the right 25% points to the right 100%. In-app Versioned Experiments via Optimizely SDK.


Offline clip editing with Core ML stylisation, Live Activities progress widget, visionOS companion.


SwiftUI View points to the right ViewModel points to the right Repo; BGTasks for resilience; 3-tier cache; AVQueuePlayer 60 fps; battery less than 3% per session.


If traffic spikes 10 times, bump CDN pre-warm, double cache size, reduce polling interval via remote config.


Thanks! Happy to dive deeper if you’d like.