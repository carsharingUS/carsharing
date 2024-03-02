import datetime
import django_filters
from .models import Travel

class TravelFilter(django_filters.FilterSet):
    start_date = django_filters.DateFilter(field_name='start_date', method='filter_start_date')
    origin = django_filters.CharFilter(field_name='origin', lookup_expr='icontains')
    destination = django_filters.CharFilter(field_name='destination', lookup_expr='icontains')

    def filter_start_date(self, queryset, name, value):
        date_str = value.strftime('%Y-%m-%d')
        return queryset.filter(**{'{}__date'.format(name): date_str})

    class Meta:
        model = Travel
        fields = {
            'origin': ['exact', 'icontains'],
            'destination': ['exact', 'icontains'],
            'start_date': ['exact', 'gte', 'lte'],
            'price': ['exact', 'gte', 'lte'],
        }
