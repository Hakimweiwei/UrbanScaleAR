using UnityEngine;
using UnityEngine.UI;

namespace UrbanScaleAR
{
    public class UIManager : MonoBehaviour
    {
        [Header("UI Elements")]
        public Text trackingStatusText;
        public Button swapMaterialButton;

        public void UpdateTrackingStatus(string status)
        {
            if (trackingStatusText != null)
            {
                trackingStatusText.text = "Status: " + status;
            }
        }

        public void OnTrackingSuccess()
        {
            UpdateTrackingStatus("Terkunci di Lokasi");
        }
        
        public void OnTrackingLost()
        {
            UpdateTrackingStatus("Mencari Permukaan...");
        }
    }
}
