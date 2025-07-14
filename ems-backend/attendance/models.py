from django.db import models
from users.models import CustomUser

class Attendance(models.Model):
    
    employee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='attendances') 
    #This establishes a many-to-one relationship
    #Many Attendance records can belong to one CustomUser (employee)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('Present', 'Present'), ('Absent', 'Absent')])
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'date')  # one record per day per employee
        ordering = ['-date'] # Descending order

    def __str__(self):
        return f"{self.employee.email} - {self.date} - {self.status}"