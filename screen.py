import cv2
import numpy as n
from PIL import ImageGrab    
def get_frame(qx=.5,qy=.5):
	im=ImageGrab.grab()
	image=n.array(im)	
	image = cv2.resize(image, (0,0), fx = qx, fy = qy)
	image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
	ret, jpeg = cv2.imencode('.jpg', image)
	return jpeg.tobytes()