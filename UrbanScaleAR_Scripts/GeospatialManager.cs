using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace UrbanScaleAR
{
    public class GeospatialManager : MonoBehaviour
    {
        public ARSessionOrigin sessionOrigin;
        
        [Header("Target Location (Example: AMIKOM Yogyakarta)")]
        public double targetLatitude = -7.759929;
        public double targetLongitude = 110.408713;
        public double targetAltitude = 150.0;
        
        public GameObject buildingPrefab;
        private GameObject spawnedBuilding;

        /*
         * UNCOMMENT THE CODE BELOW IF YOU HAVE IMPORTED ARCORE EXTENSIONS
         * AND CONFIGURED THE AREarthManager.
         */

        /*
        public Google.XR.ARCoreExtensions.AREarthManager earthManager;

        void Update()
        {
            if (earthManager == null) return;

            if (earthManager.EarthState == Google.XR.ARCoreExtensions.EarthState.Enabled 
                && earthManager.EarthTrackingState == TrackingState.Tracking)
            {
                if (spawnedBuilding == null)
                {
                    // Create an anchor at the specific GPS coordinates
                    var anchor = ARAnchorManager.AddAnchor(targetLatitude, targetLongitude, targetAltitude, Quaternion.identity);
                    
                    if (anchor != null)
                    {
                        spawnedBuilding = Instantiate(buildingPrefab, anchor.transform);
                        Debug.Log("Building placed successfully at GPS Coordinates.");
                    }
                }
            }
        }
        */
    }
}
