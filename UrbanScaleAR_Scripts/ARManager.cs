using System.Collections;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.Android;

namespace UrbanScaleAR
{
    public class ARManager : MonoBehaviour
    {
        public ARSession arSession;

        void Start()
        {
            if (arSession == null)
                arSession = FindObjectOfType<ARSession>();

            StartCoroutine(CheckARSupport());
        }

        IEnumerator CheckARSupport()
        {
            yield return ARSession.CheckAvailability();
            
            if (ARSession.state == ARSessionState.NeedsInstall)
            {
                yield return ARSession.Install();
            }

            if (ARSession.state == ARSessionState.Ready)
            {
#if UNITY_ANDROID
                // Request permissions required for ARCore Geospatial
                if (!Permission.HasUserAuthorizedPermission(Permission.Camera))
                {
                    Permission.RequestUserPermission(Permission.Camera);
                }
                if (!Permission.HasUserAuthorizedPermission(Permission.FineLocation))
                {
                    Permission.RequestUserPermission(Permission.FineLocation);
                }
#endif
                Debug.Log("AR Session is ready to use.");
            }
        }
    }
}
