from django.test import TestCase, Client
from django.urls import reverse

# Create your tests here.


class TestMainPage(TestCase):
    """
    This class test core urls
    """
    def setUp(self) -> None:
        """
        This method runs before the execution of each test case.
        """
        self.client = Client()
        self.url = reverse("login:index")

    def test_home_page_status_code(self):
        """
        Tests call the root index.html and show it
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
