-- CreateIndex
CREATE INDEX "Metric_organizationId_idx" ON "Metric"("organizationId");

-- CreateIndex
CREATE INDEX "Metric_type_date_idx" ON "Metric"("type", "date");

-- CreateIndex
CREATE INDEX "Visitor_organizationId_idx" ON "Visitor"("organizationId");

-- CreateIndex
CREATE INDEX "VisitorJourney_visitorId_idx" ON "VisitorJourney"("visitorId");
