using LiveChartsCore.SkiaSharpView.Drawing.Geometries;
using LiveChartsCore.SkiaSharpView;
using LiveChartsCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RF_Go.ViewModels
{
    public class ChartViewModel
    {
        public ISeries[] Series { get; set; } = new ISeries[]
        {
            new ColumnSeries<int> { Values = [3, 4, 2] },
            new ColumnSeries<int> { Values = [4, 2, 6] },
            new ColumnSeries<double, DiamondGeometry> { Values = [4, 3, 4] }
        };
    }
}
